import { useEffect, useRef, useState } from 'react';
import { Quote, RefreshCw, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dailyQuotes } from '@/data/zodiac';
import { ShareImageModal } from '@/components/ShareImageModal';

export function DailyQuote() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 px-6"
    >
      <div className="max-w-3xl mx-auto">
        {/* Section Title */}
        <div className={`text-center mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            今日
            <span className="text-[#d4a373]">金句</span>
          </h2>
          <p className="text-gray-600 text-lg">
            让星辰的智慧点亮你的一天
          </p>
        </div>

        {/* Quote Card */}
        <div
          className={`relative transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          <div className="bg-gradient-to-br from-[#d4a373] to-[#c49363] rounded-3xl p-6 sm:p-10 shadow-2xl text-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

            {/* Quote Icon */}
            <Quote className="absolute top-6 left-6 w-10 h-10 text-white/30" />

            {/* Content */}
            <div className="relative z-10 text-center py-6">
              <blockquote className="text-xl sm:text-2xl font-medium leading-relaxed mb-4">
                &ldquo;{currentQuote.text}&rdquo;
              </blockquote>
              <cite className="text-white/80 not-italic text-sm">
                — {currentQuote.author}
              </cite>
            </div>

            {/* Actions */}
            <div className="relative z-10 flex justify-center gap-3 mt-6 flex-wrap">
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
                onClick={() => setIsShareModalOpen(true)}
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full"
              >
                <Download className="w-4 h-4 mr-2" />
                生成图片
              </Button>
              <Button
                onClick={() => setIsShareModalOpen(true)}
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
        <div className="text-center mt-6">
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

      {/* Share Image Modal */}
      <ShareImageModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        selectedSign={null}
        horoscope={null}
        type="quote"
        quoteText={currentQuote.text}
        quoteAuthor={currentQuote.author}
      />
    </section>
  );
}
