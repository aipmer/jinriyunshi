import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronDown, Share2, Sparkles } from 'lucide-react';
import { generateHoroscope, getISOWeek } from '@/data/zodiac';
import { trackEvent } from '@/lib/analytics';
import { getFeedback, loadProfile, saveFeedback } from '@/lib/profile';
import type { HoroscopeCategory, HoroscopeFeedback, ZodiacSign } from '@/types';
import { ShareImageModal } from '@/components/ShareImageModal';
import { MonthHeatmap } from '@/components/MonthHeatmap';

interface Props { selectedSign: ZodiacSign | null; onChangeSign: () => void }

const categories: Record<HoroscopeCategory, { label: string; bg: string }> = {
  love: { label: '爱情', bg: 'bg-blush' },
  career: { label: '事业', bg: 'bg-lilac' },
  health: { label: '状态', bg: 'bg-sky' },
  wealth: { label: '财富', bg: 'bg-cream' },
};

const defaultOrder: HoroscopeCategory[] = ['love', 'career', 'health', 'wealth'];

export function HoroscopeDisplay({ selectedSign, onChangeSign }: Props) {
  const [opened, setOpened] = useState<HoroscopeCategory | null>(null);
  // 档案里勾选的「我更关注」在这里真正生效：排到前面，并默认展开第一个
  const [interests, setInterests] = useState<HoroscopeCategory[]>([]);
  const [shareOpen, setShareOpen] = useState(false);
  const today = useMemo(() => new Date(), []);
  const horoscope = useMemo(() => selectedSign ? generateHoroscope(selectedSign.id, today) : null, [selectedSign, today]);
  const contentKey = selectedSign ? `${selectedSign.id}-${horoscope?.dateRange}` : '';
  const [feedback, setFeedback] = useState<HoroscopeFeedback | null>(null);

  useEffect(() => {
    const profile = loadProfile();
    if (!profile?.interests?.length) return;
    setInterests(profile.interests);
    setOpened(profile.interests[0]);
  }, []);

  useEffect(() => {
    if (!selectedSign || !horoscope) return;
    setFeedback(getFeedback(contentKey));
    trackEvent('horoscope_detail_viewed', { sign: selectedSign.id, period: 'daily', source: 'homepage' });
  }, [selectedSign, horoscope, contentKey]);

  if (!selectedSign || !horoscope) {
    return (
      <section id="horoscope" className="px-5 py-14 sm:px-8">
        <div className="sticker mx-auto max-w-4xl bg-white p-10 text-center">
          <Sparkles className="mx-auto h-9 w-9 text-dusk" strokeWidth={2.4} aria-hidden="true" />
          <h2 className="mt-5 font-display text-2xl font-black">先选一个星座</h2>
          <p className="mt-2 text-ink/70">你的今日主题、四维解读和行动建议会显示在这里。</p>
        </div>
      </section>
    );
  }

  const week = getISOWeek(today);
  const order = [...interests, ...defaultOrder.filter((item) => !interests.includes(item))];
  const toggle = (category: HoroscopeCategory) => {
    setOpened((current) => (current === category ? null : category));
    trackEvent('horoscope_category_expanded', { sign: selectedSign.id, category, period: 'daily', source: 'homepage' });
  };
  const submitFeedback = (value: HoroscopeFeedback) => {
    setFeedback(value);
    saveFeedback(contentKey, value);
    trackEvent('horoscope_feedback', { sign: selectedSign.id, feedback: value, period: 'daily' });
  };

  return (
    <section id="horoscope" className="px-5 pb-10 pt-4 sm:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">

        {/* 星座身份条 */}
        <button type="button" onClick={onChangeSign} className="sticker-btn sticker-tilt flex min-h-16 cursor-pointer items-center gap-3 bg-lilac px-4 py-3 text-left">
          <span className="zodiac-glyph text-3xl leading-none" aria-hidden="true">{selectedSign.icon}</span>
          <span className="flex-grow">
            <strong className="block font-display text-lg font-black text-ink">{selectedSign.name}</strong>
            <span className="text-xs font-medium text-ink/60">{selectedSign.dateRange}</span>
          </span>
          <span className="sticker-chip bg-white px-4 py-2 text-sm text-ink">切换</span>
        </button>

        {/* 今日主题主卡 */}
        <article className="sticker-pop relative bg-white p-6 pt-7">
          <div className="absolute -top-4 right-4 flex h-[74px] w-[74px] rotate-[8deg] flex-col items-center justify-center rounded-full border-[2.5px] border-outline bg-gold">
            <span className="font-display text-3xl font-black leading-none tracking-tight">{horoscope.overall}</span>
            <span className="text-[9px] font-black tracking-wider">综合</span>
          </div>
          <p className="text-xs font-black tracking-[.14em] text-dusk">今日主题 · {horoscope.dateRange}</p>
          <h2 className="mt-3 max-w-[220px] font-display text-2xl font-black leading-snug text-ink sm:max-w-none sm:text-4xl">{horoscope.theme}</h2>
          <p className="mt-4 text-[15px] leading-8 text-ink/75">{horoscope.summary}</p>
        </article>

        {/* 四维：2×2 一眼可扫，详情统一开在网格下面——
            开在格子里会让另外三块跟着重排，视线每次都要重新找。 */}
        <div className="grid grid-cols-2 gap-3">
          {order.map((category) => {
            const item = horoscope.dimensions[category];
            const config = categories[category];
            const isOpen = opened === category;
            return (
              <button key={category} type="button" aria-expanded={isOpen} aria-controls="dimension-detail" onClick={() => toggle(category)} className={`sticker-sm flex min-h-14 cursor-pointer items-center justify-between px-4 py-3 text-left ${config.bg} ${isOpen ? 'ring-[3px] ring-outline ring-offset-2 ring-offset-moon' : ''}`}>
                <span className="font-display text-sm font-black text-ink">{config.label}</span>
                <span className="flex items-center gap-2">
                  <span className="font-display text-2xl font-black tracking-tight text-ink">{item.score}</span>
                  <ChevronDown className={`h-4 w-4 text-ink/50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} strokeWidth={2.6} aria-hidden="true" />
                </span>
              </button>
            );
          })}
        </div>
        {opened && (
          <div id="dimension-detail" className={`sticker animate-rise flex items-start gap-3 p-4 ${categories[opened].bg}`}>
            <span className="sticker-tag flex-shrink-0 whitespace-nowrap bg-white px-2 py-0.5 text-xs text-ink">{categories[opened].label}</span>
            <p className="text-sm leading-7 text-ink/80">{horoscope.dimensions[opened].summary}</p>
          </div>
        )}

        {/* 宜 / 忌 */}
        <div className="sticker flex flex-col gap-3 bg-white p-4">
          {horoscope.actions.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <span className="sticker-tag bg-leaf px-2 py-0.5 text-xs text-ink">宜</span>
              <span className="text-sm leading-7 text-ink/80">{item}</span>
            </div>
          ))}
          {horoscope.cautions.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <span className="sticker-tag bg-coral px-2 py-0.5 text-xs text-ink">忌</span>
              <span className="text-sm leading-7 text-ink/80">{item}</span>
            </div>
          ))}
        </div>

        {/* 幸运提示 + 周月运入口 */}
        <div className="sticker flex flex-col gap-4 bg-white p-5">
          <div className="grid grid-cols-3 gap-3">
            {[['幸运色', horoscope.luckyColor], ['幸运数字', String(horoscope.luckyNumber)], ['舒展时间', horoscope.luckyTime]].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-xs text-ink/55">{label}</span>
                <span className="font-display text-sm font-black text-ink">{value}</span>
              </div>
            ))}
          </div>
          <div id="periods" className="grid grid-cols-2 gap-3 border-t-2 border-outline/10 pt-4">
            <a href={`/weekly/${selectedSign.id}/${week.year}/${week.week}/`} onClick={() => trackEvent('period_horoscope_viewed', { sign: selectedSign.id, period: 'weekly', source: 'homepage' })} className="sticker-btn-sm flex min-h-12 items-center justify-center gap-2 bg-sky text-sm font-black text-ink">
              <CalendarDays className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" /> 本周运势
            </a>
            <a href={`/monthly/${selectedSign.id}/${today.getFullYear()}/${today.getMonth() + 1}/`} onClick={() => trackEvent('period_horoscope_viewed', { sign: selectedSign.id, period: 'monthly', source: 'homepage' })} className="sticker-btn-sm flex min-h-12 items-center justify-center gap-2 bg-cream text-sm font-black text-ink">
              <CalendarDays className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" /> 本月运势
            </a>
          </div>
        </div>

        <MonthHeatmap signId={selectedSign.id} />

        <button type="button" onClick={() => setShareOpen(true)} className="sticker-btn flex min-h-14 cursor-pointer items-center justify-center gap-2 bg-coral font-display text-base font-black text-ink">
          <Share2 className="h-5 w-5" strokeWidth={2.6} aria-hidden="true" /> 生成分享图
        </button>

        {/* 反馈 */}
        <div className="sticker bg-white p-5 text-center">
          <p className="font-display text-sm font-black text-ink">今天的内容对你有帮助吗？</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {([['helpful', '有帮助'], ['neutral', '一般'], ['not_for_me', '不太符合']] as const).map(([value, label]) => (
              <button key={value} type="button" aria-pressed={feedback === value} onClick={() => submitFeedback(value)} className={`sticker-btn-sm min-h-11 cursor-pointer px-4 py-2 text-sm font-bold text-ink ${feedback === value ? 'bg-gold' : 'bg-white'}`}>{label}</button>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-ink/50">{horoscope.disclaimer}</p>
        </div>
      </div>
      <ShareImageModal isOpen={shareOpen} onClose={() => setShareOpen(false)} selectedSign={selectedSign} horoscope={horoscope} type="horoscope" />
    </section>
  );
}
