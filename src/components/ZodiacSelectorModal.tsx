import { useEffect, useRef } from 'react';
import { zodiacSigns, elementColors } from '@/data/zodiac';
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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - 优化移动端显示 */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-md p-4 sm:p-6 animate-modalIn max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">点击选择你的星座</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
          {zodiacSigns.map((sign) => {
            const isSelected = currentSign?.id === sign.id;

            return (
              <button
                key={sign.id}
                onClick={() => handleSelect(sign)}
                className={`relative p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#d4a373] text-white shadow-lg scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-105'
                }`}
              >
                {/* Element Indicator */}
                <div
                  className={`absolute top-1.5 right-1.5 w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-gradient-to-br ${elementColors[sign.element]}`}
                />

                {/* Icon */}
                <div className="text-2xl sm:text-3xl mb-0.5 sm:mb-1">{sign.icon}</div>

                {/* Name */}
                <div className="text-xs sm:text-sm font-medium">{sign.name}</div>

                {/* Date Range */}
                <div
                  className={`text-[10px] sm:text-xs mt-0.5 ${
                    isSelected ? 'text-white/70' : 'text-gray-400'
                  }`}
                >
                  {sign.dateRange}
                </div>
              </button>
            );
          })}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
