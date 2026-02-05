import { Sparkles } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-[#212121] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Main Content - Only Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#hero');
            }}
            className="flex items-center gap-2 mb-4 group"
          >
            <Sparkles className="w-6 h-6 text-[#d4a373] group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-xl">今日运势</span>
          </a>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md">
            探索宇宙奥秘，解锁每日运势。让星辰指引你的人生旅程。
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} 今日运势. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
