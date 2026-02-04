import { useEffect, useRef, useState } from 'react';
import { Quote, RefreshCw, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dailyQuotes } from '@/data/zodiac';

export function DailyQuote() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const currentQuote = dailyQuotes[quoteIndex];

  useEffect(() => {
    // Set random quote on mount
    setQuoteIndex(Math.floor(Math.random() * dailyQuotes.length));
  }, []);

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

  const handleRefresh = () => {
    setQuoteIndex((prev) => (prev + 1) % dailyQuotes.length);
  };

  const handleCopy = async () => {
    const text = `"${currentQuote.text}" — ${currentQuote.author}`;
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    const text = `"${currentQuote.text}" — ${currentQuote.author}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: '今日运势 - 星座屋',
          text,
        });
      } catch (err) {
        console.error('Failed to share:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-32 px-6"
    >
      <div className="max-w-3xl mx-auto">
        {/* Section Title */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            每日
            <span className="text-[#d4a373]">金句</span>
          </h2>
          <p className="text-gray-600 text-lg">
            让星辰的智慧点亮你的一天
          </p>
        </div>

        {/* Quote Card */}
        <div
          ref={cardRef}
          className={`relative transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          <div className="bg-gradient-to-br from-[#d4a373] to-[#c49363] rounded-3xl p-8 sm:p-12 shadow-2xl text-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

            {/* Quote Icon */}
            <Quote className="absolute top-8 left-8 w-12 h-12 text-white/30" />

            {/* Content */}
            <div className="relative z-10 text-center py-8">
              <blockquote className="text-2xl sm:text-3xl font-medium leading-relaxed mb-6">
                "{currentQuote.text}"
              </blockquote>
              <cite className="text-white/80 not-italic">
                — {currentQuote.author}
              </cite>
            </div>

            {/* Actions */}
            <div className="relative z-10 flex justify-center gap-3 mt-8">
              <Button
                onClick={handleRefresh}
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                换一句
              </Button>
              <Button
                onClick={handleCopy}
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    复制
                  </>
                )}
              </Button>
              <Button
                onClick={handleShare}
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full"
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </Button>
            </div>
          </div>

          {/* Shadow */}
          <div className="absolute -bottom-4 left-4 right-4 h-8 bg-[#d4a373]/20 rounded-full blur-xl" />
        </div>

        {/* Date */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
