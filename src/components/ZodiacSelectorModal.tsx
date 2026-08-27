import { useEffect, useRef } from 'react';
import { zodiacSigns } from '@/data/zodiac';
import type { ZodiacSign } from '@/types';

interface ZodiacSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (sign: ZodiacSign) => void;
  currentSign: ZodiacSign | null;
  title?: string;
}

export function ZodiacSelectorModal({
  isOpen,
  onClose,
  onSelect,
  currentSign,
  title = '选择星座',
}: ZodiacSelectorModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSelect = (sign: ZodiacSign) => {
    onSelect(sign);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/45"
        onClick={onClose}
      />

      {/* Modal - 优化移动端显示 */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="zodiac-selector-title"
        className="sticker relative max-h-[85vh] w-full max-w-xs overflow-y-auto bg-moon p-4 shadow-[8px_8px_0_#372c86] sm:max-w-md sm:p-6"
      >
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h3 id="zodiac-selector-title" className="font-display text-xl font-black text-ink sm:text-2xl">{title}</h3>
          <p className="mt-1 text-xs text-ink/55 sm:text-sm">点击选择你的星座</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
          {zodiacSigns.map((sign) => {
            const isSelected = currentSign?.id === sign.id;

            return (
              <button
                key={sign.id}
                onClick={() => handleSelect(sign)}
                className={`sticker-btn-sm relative min-h-24 cursor-pointer p-2 text-ink sm:p-3 ${
                  isSelected ? 'bg-gold' : 'bg-white hover:bg-lilac'
                }`}
              >
                {/* Element Indicator */}
                {/* Icon */}
                <div className="zodiac-glyph mb-0.5 text-2xl sm:mb-1 sm:text-3xl">{sign.icon}</div>

                {/* Name */}
                <div className="font-display text-xs font-black sm:text-sm">{sign.name}</div>

                {/* Date Range */}
                <div className="mt-0.5 text-[10px] text-ink/55 sm:text-xs">{sign.dateRange}</div>
              </button>
            );
          })}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="关闭星座选择"
          className="sticker-btn-sm absolute right-3 top-3 flex h-11 w-11 cursor-pointer items-center justify-center bg-white sm:right-4 sm:top-4"
        >
          <svg className="h-4 w-4 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.6} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modalIn {
          animation: modalIn 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
}
