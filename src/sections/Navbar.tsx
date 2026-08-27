import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BrandMark } from '../components/BrandMark';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [['今日运势', '#horoscope'], ['星座配对', '#compatibility'], ['我的档案', '#profile']] as const;
  const go = (target: string) => { document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' }); setOpen(false); };
  const today = new Date();
  return (
    <>
      <nav aria-label="主导航" className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
        <div className={`sticker mx-auto flex min-h-14 bg-white max-w-6xl items-center justify-between px-4 transition-shadow duration-150 ${scrolled ? 'shadow-[6px_6px_0_#372c86]' : ''}`}>
          <button type="button" onClick={() => go('#hero')} className="flex min-h-11 cursor-pointer items-center gap-2 text-ink">
            <BrandMark className="h-6 w-6" />
            <span className="font-display text-base font-black">今日运势</span>
          </button>
          <div className="hidden items-center gap-6 md:flex">
            {links.map(([label, href]) => (
              <button key={href} type="button" onClick={() => go(href)} className="min-h-11 cursor-pointer text-sm font-bold text-ink/70 transition-colors hover:text-dusk">{label}</button>
            ))}
            <span className="sticker-chip bg-gold px-3 py-1 text-xs text-ink">{today.getMonth() + 1}.{today.getDate()}</span>
          </div>
          <button type="button" aria-label={open ? '关闭导航' : '打开导航'} aria-expanded={open} onClick={() => setOpen(!open)} className="sticker-btn-sm flex h-11 w-11 cursor-pointer items-center justify-center bg-white text-ink md:hidden">
            {open ? <X className="h-5 w-5" strokeWidth={2.6} /> : <Menu className="h-5 w-5" strokeWidth={2.6} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="fixed inset-0 z-40 bg-moon px-5 pt-28 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map(([label, href]) => (
              <button key={href} type="button" onClick={() => go(href)} className="sticker-btn min-h-14 cursor-pointer bg-white px-5 text-left text-lg font-black text-ink">{label}</button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
