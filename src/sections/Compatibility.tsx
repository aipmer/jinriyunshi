import { useEffect, useRef, useState } from 'react';
import { Heart, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { zodiacSigns } from '@/data/zodiac';
import { calculateCompatibility } from '@/data/zodiac';
import type { ZodiacSign, CompatibilityResult } from '@/types';

export function Compatibility() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const [sign1, setSign1] = useState<ZodiacSign | null>(null);
  const [sign2, setSign2] = useState<ZodiacSign | null>(null);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

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

  const handleCalculate = () => {
    if (!sign1 || !sign2) return;

    setIsCalculating(true);
    setResult(null);

    // Simulate calculation animation
    setTimeout(() => {
      const compatibility = calculateCompatibility(sign1.id, sign2.id);
      setResult(compatibility);
      setIsCalculating(false);
    }, 1500);
  };

  const handleReset = () => {
    setSign1(null);
    setSign2(null);
    setResult(null);
  };

  return (
    <section
      id="compatibility"
      ref={sectionRef}
      className="py-20 sm:py-32 px-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            星座
            <span className="text-[#d4a373]">配对</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            发现你们的 cosmic 兼容性，探索星座之间的奇妙化学反应
          </p>
        </div>

        {/* Content */}
        <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-lg transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {/* Selectors */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12">
            {/* Sign 1 */}
            <div className="relative">
              <div
                className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer ${
                  sign1
                    ? 'bg-[#d4a373] text-white shadow-xl scale-105'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                } ${isCalculating ? 'animate-spin' : ''}`}
                onClick={() => {
                  if (!isCalculating) {
                    const currentIndex = sign1 ? zodiacSigns.findIndex(s => s.id === sign1.id) : -1;
                    const nextIndex = (currentIndex + 1) % zodiacSigns.length;
                    setSign1(zodiacSigns[nextIndex]);
                  }
                }}
              >
                {sign1 ? (
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl mb-1">{sign1.icon}</div>
                    <div className="text-sm font-medium">{sign1.name}</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Heart className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm">点击选择</div>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow-md">
                <span className="text-xs text-gray-500">星座 A</span>
              </div>
            </div>

            {/* Connector */}
            <div className="flex flex-col items-center">
              <div
                className={`w-16 h-0.5 transition-all duration-500 ${
                  sign1 && sign2 ? 'bg-[#d4a373]' : 'bg-gray-200'
                }`}
              />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 -my-4 z-10 ${
                  sign1 && sign2
                    ? 'bg-[#d4a373] text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <Heart className="w-4 h-4" />
              </div>
              <div
                className={`w-16 h-0.5 transition-all duration-500 ${
                  sign1 && sign2 ? 'bg-[#d4a373]' : 'bg-gray-200'
                }`}
              />
            </div>

            {/* Sign 2 */}
            <div className="relative">
              <div
                className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer ${
                  sign2
                    ? 'bg-[#d4a373] text-white shadow-xl scale-105'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                } ${isCalculating ? 'animate-spin' : ''}`}
                onClick={() => {
                  if (!isCalculating) {
                    const currentIndex = sign2 ? zodiacSigns.findIndex(s => s.id === sign2.id) : -1;
                    const nextIndex = (currentIndex + 1) % zodiacSigns.length;
                    setSign2(zodiacSigns[nextIndex]);
                  }
                }}
              >
                {sign2 ? (
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl mb-1">{sign2.icon}</div>
                    <div className="text-sm font-medium">{sign2.name}</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Heart className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm">点击选择</div>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow-md">
                <span className="text-xs text-gray-500">星座 B</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={handleCalculate}
              disabled={!sign1 || !sign2 || isCalculating}
              className="bg-[#d4a373] hover:bg-[#c49363] text-white px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  计算中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  开始配对
                </>
              )}
            </Button>
            {(sign1 || sign2) && (
              <Button
                onClick={handleReset}
                variant="outline"
                className="px-6 py-6 rounded-full border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                重置
              </Button>
            )}
          </div>

          {/* Result */}
          {result && sign1 && sign2 && (
            <div className="animate-fadeIn">
              <div className="bg-gradient-to-br from-[#faedcd] to-[#fefae0] rounded-2xl p-8 text-center">
                {/* Score */}
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">配对指数</div>
                  <div className="text-6xl sm:text-7xl font-bold text-[#d4a373]">
                    {result.score}%
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {result.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-white/80 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed max-w-lg mx-auto">
                  {sign1.name}与{sign2.name}：{result.description}
                </p>

                {/* Visual Indicator */}
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{sign1.icon}</div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Heart
                          key={i}
                          className={`w-6 h-6 transition-all duration-300 ${
                            i < Math.round(result.score / 20)
                              ? 'fill-[#d4a373] text-[#d4a373]'
                              : 'fill-gray-300 text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-3xl">{sign2.icon}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>
    </section>
  );
}
