import { elementNames, zodiacSigns } from '@/data/zodiac';
import type { ZodiacSign } from '@/types';

interface ZodiacGridProps {
  onSelectSign: (sign: ZodiacSign) => void;
  selectedSign: ZodiacSign | null;
}

const elementBg: Record<ZodiacSign['element'], string> = {
  fire: 'bg-blush',
  earth: 'bg-cream',
  air: 'bg-lilac',
  water: 'bg-sky',
};

export function ZodiacGrid({ onSelectSign, selectedSign }: ZodiacGridProps) {
  return (
    <section id="zodiac" className="px-5 pb-14 pt-4 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div id="hero" className="mb-7 max-w-2xl">
          <h1 className="font-display text-3xl font-black leading-tight text-ink sm:text-5xl">
            选一个星座，<br className="sm:hidden" />看今天值得关注的事
          </h1>
          <p className="mt-4 text-base leading-7 text-ink/70 sm:text-lg">
            从爱情、工作、状态到财务安排，用轻量、克制的星座主题解读，帮你整理今天真正重要的那一件。
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {zodiacSigns.map((sign) => {
            const selected = selectedSign?.id === sign.id;
            return (
              <button
                key={sign.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onSelectSign(sign)}
                className={`sticker-btn min-h-32 cursor-pointer p-4 text-left text-ink ${selected ? 'bg-gold' : `${elementBg[sign.element]} hover:bg-white`}`}
              >
                <span className="zodiac-glyph block text-3xl leading-none" aria-hidden="true">{sign.icon}</span>
                <div className="mt-5 font-display text-base font-black">{sign.name}</div>
                <div className="mt-1 text-xs font-medium text-ink/60">{elementNames[sign.element]} · {sign.dateRange}</div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
