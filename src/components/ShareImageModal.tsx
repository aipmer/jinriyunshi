import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { CheckCircle2, Copy, Download, X } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import type { CompatibilityResult, HoroscopeData, ZodiacSign } from '@/types';

interface Props {
  isOpen: boolean; onClose: () => void; selectedSign: ZodiacSign | null; secondSign?: ZodiacSign | null;
  horoscope: HoroscopeData | null; compatibility?: CompatibilityResult | null; type: 'horoscope' | 'quote' | 'compatibility';
  quoteText?: string; quoteAuthor?: string;
}

export function ShareImageModal({ isOpen, onClose, selectedSign, secondSign, horoscope, compatibility, type, quoteText, quoteAuthor }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [action, setAction] = useState<'download' | 'copy' | null>(null);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [status, setStatus] = useState<'idle' | 'downloaded' | 'copied' | 'unsupported' | 'error'>('idle');

  useEffect(() => {
    if (!isOpen) return;
    setAction(null);
    setStatus('idle');
    setOrientation('portrait');
    triggerRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const focusable = cardRef.current?.closest('[role="dialog"]')?.querySelectorAll<HTMLElement>('button:not([disabled])');
        if (!focusable?.length) return;
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', keydown); triggerRef.current?.focus(); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const filename = type === 'compatibility' ? `${selectedSign?.name}_${secondSign?.name}_星座配对.png` : type === 'quote' ? '今日一句.png' : `${selectedSign?.name}_今日运势.png`;
  const captureBlob = async () => {
    if (!cardRef.current) throw new Error('card unavailable');
    const dataUrl = await toPng(cardRef.current, { pixelRatio: orientation === 'portrait' ? 3 : 2, cacheBust: true, quality: 1, backgroundColor: '#ffffff' });
    return (await fetch(dataUrl)).blob();
  };
  const downloadBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const downloadImage = async () => {
    setAction('download'); setStatus('idle');
    try {
      const blob = await captureBlob();
      trackEvent('share_image_generated', { type, sign: selectedSign?.id, orientation });
      downloadBlob(blob);
      setStatus('downloaded');
      trackEvent('share_completed', { type, sign: selectedSign?.id, method: 'download' });
    }
    catch { setStatus('error'); }
    finally { setAction(null); }
  };
  const copyImage = async () => {
    if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') {
      setStatus('unsupported');
      return;
    }
    setAction('copy'); setStatus('idle');
    try {
      const blob = await captureBlob();
      const timeout = new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error('clipboard timeout')), 6000));
      await Promise.race([
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]),
        timeout,
      ]);
      trackEvent('share_image_generated', { type, sign: selectedSign?.id, orientation });
      setStatus('copied');
      trackEvent('share_completed', { type, sign: selectedSign?.id, method: 'clipboard' });
    } catch { setStatus('error'); }
    finally { setAction(null); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="share-title" className="sticker max-h-[92vh] w-full max-w-md overflow-y-auto bg-moon p-5 shadow-[8px_8px_0_#372c86] sm:p-6">
        <div className="mb-4 flex items-center justify-between"><h2 id="share-title" className="font-display text-xl font-black">{type === 'compatibility' ? '配对结果图片' : '今日内容图片'}</h2><button ref={closeRef} type="button" aria-label="关闭" onClick={onClose} className="sticker-btn-sm flex h-11 w-11 cursor-pointer items-center justify-center bg-white"><X className="h-5 w-5" strokeWidth={2.6} /></button></div>
        <div className="mb-4 flex gap-2">
          {(['portrait', 'landscape'] as const).map((value) => (
            <button key={value} type="button" onClick={() => setOrientation(value)} aria-pressed={orientation === value} className={`sticker-btn-sm min-h-11 flex-grow cursor-pointer text-sm font-black text-ink ${orientation === value ? 'bg-gold' : 'bg-white'}`}>
              {value === 'portrait' ? '竖版 9:16' : '横版'}
            </button>
          ))}
        </div>
        <div ref={cardRef} className={`relative mx-auto overflow-hidden rounded-[18px] border-[2.5px] border-outline bg-white ${orientation === 'portrait' ? 'flex aspect-[9/16] w-[320px] flex-col justify-between p-6' : 'p-6'}`}>
          
          {type === 'horoscope' && selectedSign && horoscope && <div className="relative"><div className="flex items-center gap-3"><span className="zodiac-glyph text-4xl">{selectedSign.icon}</span><div><div className="font-display font-black">{selectedSign.name} · 今日运势</div><div className="text-xs text-ink/55">{horoscope.dateRange}</div></div></div><p className="mt-8 font-display text-3xl font-black leading-snug">{horoscope.theme}</p><div className="mt-6 flex items-end justify-between border-b-2 border-outline/15 pb-5"><span className="text-sm text-ink/55">综合指数</span><strong className="font-display text-6xl font-black tracking-tight text-dusk">{horoscope.overall}</strong></div><p className="mt-5 text-sm leading-7 text-ink/75">{horoscope.summary}</p><div className="mt-5 grid grid-cols-4 gap-2">{[['爱情', horoscope.love], ['事业', horoscope.career], ['状态', horoscope.health], ['财富', horoscope.wealth]].map(([label, value]) => <div key={label} className="rounded-xl border-2 border-outline bg-lilac p-2 text-center"><div className="text-[10px] text-ink/60">{label}</div><strong className="font-display text-lg font-black text-ink">{value}</strong></div>)}</div></div>}
          {type === 'compatibility' && selectedSign && secondSign && compatibility && <div className="relative text-center"><div className="zodiac-glyph text-5xl">{selectedSign.icon} <span className="text-2xl text-coral">×</span> {secondSign.icon}</div><p className="mt-3 font-display font-black">{selectedSign.name}与{secondSign.name}</p><div className="mt-5 font-display text-7xl font-black tracking-tight text-dusk">{compatibility.score}</div><p className="mt-4 text-sm leading-7 text-ink/75">{compatibility.description}</p><div className="mt-5 grid grid-cols-2 gap-2">{Object.entries(compatibility.dimensions).map(([key, value]) => <div key={key} className="rounded-xl border-2 border-outline bg-sky p-3 text-sm text-ink/80"><strong className="mr-2 font-display font-black text-ink">{value.score}</strong>{key === 'chemistry' ? '默契' : key === 'communication' ? '沟通' : key === 'emotion' ? '情感' : '长期'}</div>)}</div></div>}
          {type === 'quote' && <div className="relative"><p className="font-display text-2xl font-black leading-relaxed">「{quoteText}」</p><p className="mt-5 text-sm text-ink/55">{quoteAuthor}</p></div>}
          <div className={`relative border-t-2 border-outline/15 pt-4 text-center text-xs font-black tracking-wide text-dusk ${orientation === 'portrait' ? '' : 'mt-6'}`}>今日运势 · 每天一点清晰</div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3"><button type="button" disabled={action !== null} onClick={downloadImage} className="sticker-btn-sm inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 bg-white font-black text-ink disabled:opacity-50"><Download className="h-4 w-4" />{action === 'download' ? '生成中…' : '下载图片'}</button><button type="button" disabled={action !== null} onClick={copyImage} className="sticker-btn-sm inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 bg-gold font-black text-ink disabled:opacity-50"><Copy className="h-4 w-4" />{action === 'copy' ? '复制中…' : '复制图片'}</button></div>
        <div aria-live="polite" className="mt-3 min-h-6 text-center text-sm">{status === 'downloaded' && <span className="inline-flex items-center gap-1 text-[#39734e]"><CheckCircle2 className="h-4 w-4" />图片已下载</span>}{status === 'copied' && <span className="inline-flex items-center gap-1 text-[#39734e]"><CheckCircle2 className="h-4 w-4" />图片已复制，可直接粘贴</span>}{status === 'unsupported' && <span className="text-amber-700">当前浏览器不支持复制图片，请使用下载图片</span>}{status === 'error' && <span className="text-red-600">操作失败，请重试或使用下载图片</span>}</div>
      </div>
    </div>
  );
}
