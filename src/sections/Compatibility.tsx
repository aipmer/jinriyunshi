import { useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight, HeartHandshake, RefreshCw, Share2 } from 'lucide-react';
import { calculateCompatibility, getCanonicalCompatibilityPair, zodiacSigns } from '@/data/zodiac';
import { trackEvent } from '@/lib/analytics';
import type { ZodiacSign } from '@/types';
import { ShareImageModal } from '@/components/ShareImageModal';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props { selectedSign: ZodiacSign | null; onChangeSign: (sign: ZodiacSign) => void }
const dimensionLabels = { chemistry: '默契', communication: '沟通', emotion: '情感', longTerm: '长期相处' };

export function Compatibility({ selectedSign, onChangeSign }: Props) {
  const [first, setFirst] = useState(selectedSign?.id ?? '');
  const [second, setSecond] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  useEffect(() => { if (selectedSign) setFirst(selectedSign.id); }, [selectedSign]);
  const result = useMemo(() => calculated && first && second ? calculateCompatibility(first, second) : null, [calculated, first, second]);
  const firstSign = zodiacSigns.find((item) => item.id === first) ?? null;
  const secondSign = zodiacSigns.find((item) => item.id === second) ?? null;

  const calculate = () => {
    if (!first || !second) return;
    setCalculated(true);
    trackEvent('compatibility_started', { sign_a: first, sign_b: second, source: 'homepage' });
    trackEvent('compatibility_completed', { sign_a: first, sign_b: second, source: 'homepage' });
  };
  const changeFirst = (id: string) => { setFirst(id); setCalculated(false); const sign = zodiacSigns.find((item) => item.id === id); if (sign) onChangeSign(sign); };
  const swap = () => { setFirst(second); setSecond(first); setCalculated(false); };
  const detailUrl = first && second ? `/compatibility/${getCanonicalCompatibilityPair(first, second).join('/')}/` : '#';

  return (
    <section id="compatibility" className="border-y-[3px] border-outline bg-lilac px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-black tracking-[.16em] text-dusk">星座配对</p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="font-display text-3xl font-black sm:text-5xl">两种节奏，如何相遇</h2><p className="mt-4 max-w-2xl text-ink/70">从默契、沟通、情感和长期相处四个角度，获得一份轻量的关系提示。</p></div><div className="sticker-btn-sm sticker-tilt-r hidden h-14 w-14 items-center justify-center bg-coral sm:flex"><HeartHandshake className="h-7 w-7 text-ink" strokeWidth={2.4} aria-hidden="true" /></div></div>

        <div className="sticker mt-8 bg-white p-5 sm:p-8">
          <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr_auto]">
            <div><label htmlFor="compatibility-first" className="mb-2 block text-sm font-black text-ink">星座 A</label><Select value={first} onValueChange={changeFirst}><SelectTrigger id="compatibility-first" className="w-full" aria-label="星座 A"><SelectValue placeholder="请选择" /></SelectTrigger><SelectContent position="popper" side="bottom" align="start" sideOffset={8} avoidCollisions={false}><SelectGroup>{zodiacSigns.map((sign) => <SelectItem key={sign.id} value={sign.id}>{sign.icon} {sign.name}</SelectItem>)}</SelectGroup></SelectContent></Select></div>
            <button type="button" aria-label="交换两个星座" onClick={swap} disabled={!first || !second} className="sticker-btn-sm flex h-12 w-12 cursor-pointer items-center justify-center bg-white text-ink disabled:opacity-40"><ArrowLeftRight className="h-5 w-5" /></button>
            <div><label htmlFor="compatibility-second" className="mb-2 block text-sm font-black text-ink">星座 B</label><Select value={second} onValueChange={(value) => { setSecond(value); setCalculated(false); }}><SelectTrigger id="compatibility-second" className="w-full" aria-label="星座 B"><SelectValue placeholder="请选择" /></SelectTrigger><SelectContent position="popper" side="bottom" align="start" sideOffset={8} avoidCollisions={false}><SelectGroup>{zodiacSigns.map((sign) => <SelectItem key={sign.id} value={sign.id}>{sign.icon} {sign.name}</SelectItem>)}</SelectGroup></SelectContent></Select></div>
            <button type="button" onClick={calculate} disabled={!first || !second} className="sticker-btn min-h-12 cursor-pointer bg-coral px-6 font-black text-ink disabled:opacity-40">查看结果</button>
          </div>

          {result && firstSign && secondSign && (
            <div aria-live="polite" className="animate-rise mt-8 border-t-2 border-outline/15 pt-8">
              <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
                <div className="text-center lg:text-left"><div className="text-sm font-bold text-ink/60">{firstSign.name} × {secondSign.name}</div><div className="mt-2 font-display text-7xl font-black tracking-tight text-dusk">{result.score}</div><p className="mt-3 leading-7 text-ink/75">{result.description}</p></div>
                <div className="grid grid-cols-2 gap-3">{Object.entries(result.dimensions).map(([key, item]) => <div key={key} className="sticker-sm bg-white p-4"><div className="flex items-center justify-between text-sm"><span className="font-bold text-ink/70">{dimensionLabels[key as keyof typeof dimensionLabels]}</span><strong className="font-display text-xl font-black">{item.score}</strong></div><div className="mt-3 h-2.5 overflow-hidden rounded-full border-2 border-outline bg-white"><div className="h-full bg-dusk" style={{ width: `${item.score}%` }} /></div></div>)}</div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="sticker-sm bg-sky p-5"><h3 className="font-display font-black text-ink">相处优势</h3><ul className="mt-2 space-y-1 text-sm text-ink/75">{result.strengths.map((item) => <li key={item}>· {item}</li>)}</ul></div><div className="sticker-sm bg-blush p-5"><h3 className="font-display font-black text-ink">需要留意</h3><ul className="mt-2 space-y-1 text-sm text-ink/75">{result.frictions.map((item) => <li key={item}>· {item}</li>)}</ul></div></div>
              <p className="mt-5 text-sm leading-6 text-ink/60">{result.advice}</p>
              <div className="mt-6 flex flex-wrap gap-3"><a href={detailUrl} className="sticker-btn-sm inline-flex min-h-11 items-center bg-gold px-4 font-black text-ink">打开完整配对页</a><button type="button" onClick={() => setShareOpen(true)} className="sticker-btn-sm inline-flex min-h-11 cursor-pointer items-center gap-2 bg-white px-4 font-black text-ink"><Share2 className="h-4 w-4" />生成配对图</button><button type="button" onClick={() => { setSecond(''); setCalculated(false); }} className="inline-flex min-h-11 cursor-pointer items-center gap-2 px-3 font-bold text-ink/60"><RefreshCw className="h-4 w-4" />重新选择</button></div>
            </div>
          )}
        </div>
      </div>
      <ShareImageModal isOpen={shareOpen} onClose={() => setShareOpen(false)} selectedSign={firstSign} secondSign={secondSign} horoscope={null} compatibility={result} type="compatibility" />
    </section>
  );
}
