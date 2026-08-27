import { useMemo, useState } from 'react';
import { generateHoroscope } from '@/data/zodiac';
import { trackEvent } from '@/lib/analytics';

interface Props { signId: string }

/** 站内静态页覆盖 2026—2027，超出范围就不给链接，避免点进 404 */
const MIN_YEAR = 2026;
const MAX_YEAR = 2027;

// 引擎给出的综合指数落在 66—95 区间，四档按这个真实区间分，
// 否则颜色会全挤在一档里，热力图就白做了。
function tone(score: number) {
  if (score >= 88) return 'bg-gold';
  if (score >= 81) return 'bg-cream';
  if (score >= 74) return 'bg-lilac';
  return 'bg-sky';
}

function dayHref(signId: string, date: Date) {
  const year = date.getFullYear();
  if (year < MIN_YEAR || year > MAX_YEAR) return null;
  return `/${signId}/${year}/${date.getMonth() + 1}/${date.getDate()}/`;
}

export function MonthHeatmap({ signId }: Props) {
  const [expanded, setExpanded] = useState(false);
  const today = useMemo(() => new Date(), []);

  // 复用现成的确定性引擎逐日算分，不需要任何新内容
  const days = useMemo(() => {
    const list = expanded
      ? Array.from({ length: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() }, (_, index) => new Date(today.getFullYear(), today.getMonth(), index + 1))
      : Array.from({ length: 14 }, (_, index) => {
          const date = new Date(today);
          date.setDate(date.getDate() - 13 + index);
          return date;
        });
    return list.map((date) => ({
      date,
      score: generateHoroscope(signId, date).overall,
      href: dayHref(signId, date),
      isToday: date.toDateString() === today.toDateString(),
    }));
  }, [signId, expanded, today]);

  const toggle = () => {
    setExpanded((current) => !current);
    if (!expanded) trackEvent('heatmap_expanded', { sign: signId });
  };

  return (
    <div className="sticker flex flex-col gap-3 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="font-display text-sm font-black text-ink">{expanded ? `${today.getMonth() + 1} 月每天` : '近 14 天'}</span>
        <button type="button" onClick={toggle} className="min-h-11 cursor-pointer text-xs font-black text-dusk">
          {expanded ? '收起' : '看全月'}
        </button>
      </div>
      <div className={expanded ? 'grid grid-cols-7 gap-1.5' : 'flex gap-1.5'}>
        {days.map(({ date, score, href, isToday }) => {
          const label = `${date.getMonth() + 1}月${date.getDate()}日 综合 ${score} 分`;
          const cell = `flex ${expanded ? 'aspect-square min-h-10 flex-col items-center justify-center gap-0.5' : 'h-8 flex-grow items-center justify-center'} rounded-md border-2 ${isToday ? 'border-dusk' : 'border-outline'} ${tone(score)}`;
          const content = expanded ? (
            <>
              <span className="text-[10px] font-bold text-ink/55">{date.getDate()}</span>
              <span className="font-display text-xs font-black text-ink">{score}</span>
            </>
          ) : null;
          return href
            ? <a key={label} href={href} title={label} aria-label={label} className={`${cell} cursor-pointer`}>{content}</a>
            : <span key={label} title={label} aria-label={label} className={cell}>{content}</span>;
        })}
      </div>
      {!expanded && <p className="text-xs text-ink/50">颜色越暖，那天的综合指数越高。点一格看那天的完整运势。</p>}
    </div>
  );
}
