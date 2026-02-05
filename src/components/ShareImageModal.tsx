import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Download, X, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ZodiacSign, HoroscopeData } from '@/types';

interface ShareImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSign: ZodiacSign | null;
  horoscope: HoroscopeData | null;
  type: 'horoscope' | 'quote';
  quoteText?: string;
  quoteAuthor?: string;
}

export function ShareImageModal({
  isOpen,
  onClose,
  selectedSign,
  horoscope,
  type,
  quoteText,
  quoteAuthor,
}: ShareImageModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const generateImage = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = type === 'horoscope' 
        ? `${selectedSign?.name}_今日运势.png`
        : '今日金句.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const shareImage = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });

      if (blob && navigator.share) {
        const file = new File([blob], type === 'horoscope' ? '今日运势.png' : '今日金句.png', { type: 'image/png' });
        await navigator.share({
          title: type === 'horoscope' ? '今日运势' : '今日金句',
          files: [file],
        });
      } else {
        // Fallback to download if share not supported
        generateImage();
      }
    } catch (error) {
      console.error('Failed to share image:', error);
      generateImage();
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - 优化移动端显示 */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md p-4 sm:p-6 animate-modalIn max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            {type === 'horoscope' ? '分享今日运势' : '分享今日金句'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Preview Card - 使用响应式宽度 */}
        <div className="mb-4 overflow-hidden rounded-2xl flex justify-center">
          {type === 'horoscope' && selectedSign && horoscope ? (
            <div
              ref={cardRef}
              className="bg-gradient-to-br from-[#faedcd] to-[#fefae0] p-4 sm:p-6 w-full max-w-[320px] sm:max-w-[340px]"
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">{selectedSign.icon}</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedSign.name}今日运势</h2>
                  <p className="text-xs text-gray-500">{today}</p>
                </div>
              </div>

              {/* Overall Score */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">综合运势</span>
                  <span className="text-xl font-bold text-[#d4a373]">{horoscope.overall}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#d4a373] rounded-full"
                    style={{ width: `${horoscope.overall}%` }}
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { label: '爱情', value: horoscope.love },
                  { label: '事业', value: horoscope.career },
                  { label: '健康', value: horoscope.health },
                  { label: '财运', value: horoscope.wealth },
                ].map((item) => (
                  <div key={item.label} className="bg-white/60 backdrop-blur-sm rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                    <p className="text-base font-bold text-[#d4a373]">{item.value}%</p>
                  </div>
                ))}
              </div>

              {/* Lucky Info */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-2 mb-3">
                <div className="flex justify-around text-center">
                  <div>
                    <p className="text-xs text-gray-500">幸运色</p>
                    <p className="text-xs font-medium text-gray-900">{horoscope.luckyColor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">幸运数字</p>
                    <p className="text-xs font-medium text-gray-900">{horoscope.luckyNumber}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">{horoscope.description}</p>
              </div>

              {/* Footer */}
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-400">今日运势</p>
              </div>
            </div>
          ) : type === 'quote' ? (
            <div
              ref={cardRef}
              className="bg-gradient-to-br from-[#d4a373] to-[#c49363] p-4 sm:p-6 w-full max-w-[320px] sm:max-w-[340px]"
            >
              {/* Quote Icon */}
              <div className="text-4xl sm:text-5xl text-white/20 mb-2">&ldquo;</div>

              {/* Quote Text */}
              <p className="text-base sm:text-lg text-white font-medium leading-relaxed mb-4">
                {quoteText}
              </p>

              {/* Author */}
              <p className="text-white/80 text-right text-sm">— {quoteAuthor}</p>

              {/* Date */}
              <p className="text-white/60 text-xs mt-4">{today}</p>

              {/* Footer */}
              <div className="mt-3 text-center">
                <p className="text-xs text-white/40">今日金句</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={generateImage}
            disabled={isGenerating}
            className="flex-1 bg-[#d4a373] hover:bg-[#c49363] text-white rounded-full text-sm sm:text-base"
          >
            <Download className="w-4 h-4 mr-1 sm:mr-2" />
            {isGenerating ? '生成中...' : '下载图片'}
          </Button>
          <Button
            onClick={shareImage}
            disabled={isGenerating}
            variant="outline"
            className="flex-1 rounded-full border-gray-300 text-sm sm:text-base"
          >
            <Share2 className="w-4 h-4 mr-1 sm:mr-2" />
            分享
          </Button>
        </div>
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
