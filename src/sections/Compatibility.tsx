import { useEffect, useRef, useState } from 'react';
import { Heart, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateCompatibility } from '@/data/zodiac';
import { ZodiacSelectorModal } from '@/components/ZodiacSelectorModal';
import type { ZodiacSign, CompatibilityResult } from '@/types';

interface CompatibilityProps {
  selectedSign: ZodiacSign | null;
  onChangeSign: (sign: ZodiacSign) => void;
}

export function Compatibility({ selectedSign, onChangeSign }: CompatibilityProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const [sign1, setSign1] = useState<ZodiacSign | null>(null);
  const [sign2, setSign2] = useState<ZodiacSign | null>(null);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSign1ModalOpen, setIsSign1ModalOpen] = useState(false);
  const [isSign2ModalOpen, setIsSign2ModalOpen] = useState(false);

  // Set sign1 to selectedSign when it changes
  useEffect(() => {
    if (selectedSign) {
      setSign1(selectedSign);
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

  const handleSign1Select = (sign: ZodiacSign) => {
    setSign1(sign);
    onChangeSign(sign); // Sync with global state
  };

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
    setSign1(selectedSign);
    setSign2(null);
    setResult(null);
  };

  return (
    <section
      id="compatibility"
      ref={sectionRef}
      className="py-12 sm:py-16 px-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <div className={`text-center mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            星座
            <span className="text-[#d4a373]">配对</span>
          </h2>
        </div>

        {/* Content */}
        <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {/* Selectors - 优化布局 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
            {/* Sign 1 */}
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-2 font-medium">星座 A</div>
              <div
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer ${
                  sign1
                    ? 'bg-[#d4a373] text-white shadow-xl'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                } ${isCalculating ? 'animate-spin' : ''}`}
                onClick={() => setIsSign1ModalOpen(true)}
              >
                {sign1 ? (
                  <span className="text-4xl sm:text-5xl">{sign1.icon}</span>
                ) : (
                  <Heart className="w-8 h-8" />
                )}
              </div>
              <div className="mt-2 text-sm font-medium text-gray-700">
                {sign1 ? sign1.name : '点击选择'}
              </div>
            </div>

            {/* Connector */}
            <div className="flex flex-col items-center py-2">
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
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-2 font-medium">星座 B</div>
              <div
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer ${
                  sign2
                    ? 'bg-[#d4a373] text-white shadow-xl'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                } ${isCalculating ? 'animate-spin' : ''}`}
                onClick={() => setIsSign2ModalOpen(true)}
              >
                {sign2 ? (
                  <span className="text-4xl sm:text-5xl">{sign2.icon}</span>
                ) : (
                  <Heart className="w-8 h-8" />
                )}
              </div>
              <div className="mt-2 text-sm font-medium text-gray-700">
                {sign2 ? sign2.name : '点击选择'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-6">
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
              <div className="bg-gradient-to-br from-[#faedcd] to-[#fefae0] rounded-2xl p-6 text-center">
                {/* Score */}
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">配对指数</div>
                  <div className="text-5xl sm:text-6xl font-bold text-[#d4a373]">
                    {result.score}%
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
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
                <p className="text-gray-700 leading-relaxed max-w-lg mx-auto text-sm">
                  {sign1.name}与{sign2.name}：{result.description}
                </p>

                {/* Visual Indicator */}
                <div className="mt-6 flex justify-center">
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

      {/* Zodiac Selector Modals */}
      <ZodiacSelectorModal
        isOpen={isSign1ModalOpen}
        onClose={() => setIsSign1ModalOpen(false)}
        onSelect={handleSign1Select}
        currentSign={sign1}
        title="选择星座 A"
      />
      <ZodiacSelectorModal
        isOpen={isSign2ModalOpen}
        onClose={() => setIsSign2ModalOpen(false)}
        onSelect={setSign2}
        currentSign={sign2}
        title="选择星座 B"
      />

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
