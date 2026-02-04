import { useEffect, useRef, useState } from 'react';
import { zodiacSigns, elementColors, elementNames } from '@/data/zodiac';
import type { ZodiacSign } from '@/types';

interface ZodiacGridProps {
  onSelectSign: (sign: ZodiacSign) => void;
  selectedSign: ZodiacSign | null;
}

export function ZodiacGrid({ onSelectSign, selectedSign }: ZodiacGridProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSign, setHoveredSign] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="zodiac"
      ref={sectionRef}
      className="py-20 sm:py-32 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            选择你的
            <span className="text-[#d4a373]">星座</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            点击你的星座，解锁今日的宇宙指引
          </p>
        </div>

        {/* Zodiac Grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6"
          style={{ perspective: '1000px' }}
        >
          {zodiacSigns.map((sign, index) => {
            const isSelected = selectedSign?.id === sign.id;
            const isHovered = hoveredSign === sign.id;

            return (
              <div
                key={sign.id}
                className={`zodiac-card relative group cursor-pointer transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                } ${index % 2 === 0 ? 'lg:translate-y-0' : 'lg:translate-y-4'}`}
                style={{
                  transformStyle: 'preserve-3d',
                  transitionDelay: isVisible ? `${index * 50}ms` : '0ms',
                }}
                onClick={() => onSelectSign(sign)}
                onMouseEnter={() => setHoveredSign(sign.id)}
                onMouseLeave={() => setHoveredSign(null)}
              >
                <div
                  className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#d4a373] text-white shadow-xl scale-105'
                      : 'bg-white/80 backdrop-blur-sm text-gray-900 hover:bg-white shadow-lg hover:shadow-xl'
                  }`}
                  style={{
                    transform: isHovered && !isSelected
                      ? 'translateY(-4px)'
                      : 'translateY(0)',
                  }}
                >
                  {/* Element Indicator */}
                  <div
                    className={`absolute top-3 right-3 w-2 h-2 rounded-full bg-gradient-to-br ${elementColors[sign.element]}`}
                  />

                  {/* Icon */}
                  <div className="text-4xl sm:text-5xl mb-4 text-center transition-transform duration-300 group-hover:scale-110">
                    {sign.icon}
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-semibold text-center mb-1">
                    {sign.name}
                  </h3>

                  {/* Date Range */}
                  <p
                    className={`text-xs text-center transition-colors ${
                      isSelected ? 'text-white/80' : 'text-gray-500'
                    }`}
                  >
                    {sign.dateRange}
                  </p>

                  {/* Element Tag (shown on hover) */}
                  <div
                    className={`absolute inset-x-0 bottom-0 text-center py-2 text-xs font-medium transition-all duration-300 ${
                      isHovered || isSelected
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-2'
                    } ${isSelected ? 'text-white/90' : 'text-[#d4a373]'}`}
                  >
                    {elementNames[sign.element]}
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute inset-0 border-2 border-white/50 rounded-2xl animate-pulse" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Sign Info */}
        {selectedSign && (
          <div className="mt-12 text-center animate-fadeIn">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <span className="text-2xl">{selectedSign.icon}</span>
              <span className="font-semibold text-gray-900">
                已选择：{selectedSign.name}
              </span>
              <span className="text-sm text-gray-500">
                {elementNames[selectedSign.element]}星座
              </span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease forwards;
        }
      `}</style>
    </section>
  );
}
