import { useEffect, useRef, useState } from 'react';
import { Heart, Briefcase, Activity, Coins, Star, Sparkles, Clock, Palette } from 'lucide-react';
import type { ZodiacSign, HoroscopeData, HoroscopeCategory } from '@/types';
import { generateHoroscope } from '@/data/zodiac';
import { Progress } from '@/components/ui/progress';

interface HoroscopeDisplayProps {
  selectedSign: ZodiacSign | null;
}

const categoryConfig: Record<HoroscopeCategory, { icon: typeof Heart; label: string; color: string }> = {
  love: { icon: Heart, label: '爱情', color: 'text-rose-500' },
  career: { icon: Briefcase, label: '事业', color: 'text-blue-500' },
  health: { icon: Activity, label: '健康', color: 'text-green-500' },
  wealth: { icon: Coins, label: '财运', color: 'text-amber-500' },
};

export function HoroscopeDisplay({ selectedSign }: HoroscopeDisplayProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [expandedCard, setExpandedCard] = useState<HoroscopeCategory | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (selectedSign) {
      const data = generateHoroscope(selectedSign.id);
      setHoroscope(data);
    }
  }, [selectedSign]);

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

  const renderStars = (score: number) => {
    const starCount = Math.round(score / 20);
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < starCount
                ? 'fill-[#d4a373] text-[#d4a373]'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  if (!selectedSign) {
    return (
      <section
        id="horoscope"
        ref={sectionRef}
        className="py-20 sm:py-32 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-lg">
            <Sparkles className="w-16 h-16 text-[#d4a373] mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              请先选择你的星座
            </h3>
            <p className="text-gray-500">
              向上滚动选择星座，解锁今日运势
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="horoscope"
      ref={sectionRef}
      className="py-20 sm:py-32 px-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg mb-6">
            <span className="text-3xl">{selectedSign.icon}</span>
            <div className="text-left">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedSign.name}今日运势
              </h2>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Overall Score */}
        {horoscope && (
          <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-700">综合运势</span>
              <span className="text-3xl font-bold text-[#d4a373]">{horoscope.overall}%</span>
            </div>
            <Progress value={horoscope.overall} className="h-3 mb-4" />
            <p className="text-gray-600 leading-relaxed">{horoscope.description}</p>
          </div>
        )}

        {/* Category Cards */}
        <div className="space-y-4">
          {horoscope &&
            (Object.keys(categoryConfig) as HoroscopeCategory[]).map((category, index) => {
              const config = categoryConfig[category];
              const Icon = config.icon;
              const score = horoscope[category];
              const isExpanded = expandedCard === category;

              return (
                <div
                  key={category}
                  className={`horoscope-card transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                  style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                  onClick={() => setExpandedCard(isExpanded ? null : category)}
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer ${
                      isExpanded ? 'shadow-xl' : 'hover:shadow-xl'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Icon className={`w-6 h-6 ${config.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{config.label}</h3>
                          {renderStars(score)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-[#d4a373]">{score}%</span>
                        <div
                          className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-transform duration-300 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        >
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isExpanded ? 'max-h-40' : 'max-h-0'
                      }`}
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-[#d4a373] mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {category === 'love' && '感情方面，'}
                            {category === 'career' && '事业上，'}
                            {category === 'health' && '健康方面，'}
                            {category === 'wealth' && '财运方面，'}
                            今天的运势指数显示{score >= 80 ? '非常顺利' : score >= 60 ? '平稳发展' : '需要谨慎'}。
                            保持积极心态，把握机会。
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="px-6 pb-6">
                      <Progress value={score} className="h-2" />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Lucky Info */}
        {horoscope && (
          <div className={`mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {[
              { icon: Palette, label: '幸运色', value: horoscope.luckyColor },
              { icon: Star, label: '幸运数字', value: horoscope.luckyNumber.toString() },
              { icon: Clock, label: '幸运时段', value: horoscope.luckyTime },
              { icon: Sparkles, label: '今日建议', value: horoscope.advice },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/80 transition-colors"
                >
                  <Icon className="w-5 h-5 text-[#d4a373] mx-auto mb-2" />
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.value}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
