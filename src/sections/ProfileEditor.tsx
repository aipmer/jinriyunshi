import { useEffect, useRef, useState } from 'react';
import { BookmarkCheck, CalendarDays, RotateCcw, UserRound } from 'lucide-react';
import { zodiacSigns } from '@/data/zodiac';
import { trackEvent } from '@/lib/analytics';
import { clearProfile, loadProfile, saveProfile } from '@/lib/profile';
import type { HoroscopeCategory, ZodiacSign } from '@/types';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props { selectedSign: ZodiacSign | null; onSelectSign: (sign: ZodiacSign) => void }
const interests: Array<[HoroscopeCategory, string]> = [['love', '关系'], ['career', '事业'], ['health', '状态'], ['wealth', '财富']];

export function ProfileEditor({ selectedSign, onSelectSign }: Props) {
  const [birthday, setBirthday] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<HoroscopeCategory[]>(['career']);
  const [saved, setSaved] = useState(false);
  const birthdayRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const profile = loadProfile();
    if (!profile) return;
    setBirthday(profile.birthday ?? '');
    setSelectedInterests(profile.interests);
    setSaved(true);
  }, []);

  const submit = () => {
    if (!selectedSign) return;
    saveProfile({ signId: selectedSign.id, birthday: birthday || undefined, interests: selectedInterests });
    setSaved(true);
    trackEvent('profile_saved', { sign: selectedSign.id, interest_count: selectedInterests.length });
  };
  const reset = () => { clearProfile(); setBirthday(''); setSelectedInterests(['career']); setSaved(false); };
  const toggleInterest = (interest: HoroscopeCategory) => setSelectedInterests((current) => current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]);
  const openBirthdayPicker = () => {
    const input = birthdayRef.current;
    if (!input) return;
    input.focus({ preventScroll: true });
    try { input.showPicker?.(); } catch { /* Native input remains usable as fallback. */ }
  };

  return (
    <section id="profile" className="px-5 py-16 sm:px-8">
      <div className="sticker mx-auto grid bg-white max-w-5xl gap-8 p-6 sm:p-8 lg:grid-cols-[.75fr_1.25fr]">
        <div>
          <div className="sticker-btn-sm inline-flex h-12 w-12 items-center justify-center bg-lilac"><UserRound className="h-6 w-6 text-ink" strokeWidth={2.4} aria-hidden="true" /></div>
          <h2 className="mt-4 font-display text-2xl font-black sm:text-3xl">保存我的星座档案</h2>
          <p className="mt-3 leading-7 text-ink/70">只保存在当前设备，下次直接打开你的运势。无需注册，也不会上传出生日期。</p>
        </div>
        <div className="space-y-5">
          <div>
            <label htmlFor="profile-sign" className="mb-2 block text-sm font-black">太阳星座</label>
            <Select value={selectedSign?.id ?? ''} onValueChange={(value) => { const sign = zodiacSigns.find((item) => item.id === value); if (sign) onSelectSign(sign); }}>
              <SelectTrigger id="profile-sign" className="w-full" aria-label="太阳星座"><SelectValue placeholder="请选择" /></SelectTrigger>
              <SelectContent position="popper" side="bottom" align="start" sideOffset={8} avoidCollisions={false}><SelectGroup>{zodiacSigns.map((sign) => <SelectItem key={sign.id} value={sign.id}>{sign.icon} {sign.name}</SelectItem>)}</SelectGroup></SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="profile-birthday" className="mb-2 block text-sm font-black">出生日期（可选）</label>
            <div className="relative">
              <input ref={birthdayRef} id="profile-birthday" type="date" value={birthday} onClick={openBirthdayPicker} onChange={(event) => setBirthday(event.target.value)} className="sticker-btn-sm min-h-12 w-full cursor-pointer bg-white px-4 pr-12 text-base text-ink outline-none [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:size-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0" />
              <CalendarDays className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-ink" strokeWidth={2.4} aria-hidden="true" />
            </div>
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-black">我更关注</legend>
            <p className="mb-3 text-xs text-ink/55">勾选的维度会在今日运势里排到前面，并默认展开。</p>
            <div className="flex flex-wrap gap-2">
              {interests.map(([value, label]) => (
                <button key={value} type="button" aria-pressed={selectedInterests.includes(value)} onClick={() => toggleInterest(value)} className={`sticker-btn-sm min-h-11 cursor-pointer px-4 text-sm font-bold text-ink ${selectedInterests.includes(value) ? 'bg-gold' : 'bg-white'}`}>{label}</button>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-wrap gap-3">
            <button type="button" disabled={!selectedSign} onClick={submit} className="sticker-btn inline-flex min-h-12 cursor-pointer items-center gap-2 bg-dusk px-5 font-black text-white disabled:opacity-50"><BookmarkCheck className="h-4 w-4" strokeWidth={2.6} />{saved ? '更新档案' : '保存档案'}</button>
            {saved && <button type="button" onClick={reset} className="sticker-btn-sm inline-flex min-h-12 cursor-pointer items-center gap-2 bg-white px-5 font-bold text-ink"><RotateCcw className="h-4 w-4" strokeWidth={2.4} />清除</button>}
          </div>
        </div>
      </div>
    </section>
  );
}
