import { Sparkles } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { label: '首页', href: '#hero' },
      { label: '星座', href: '#zodiac' },
      { label: '运势', href: '#horoscope' },
      { label: '配对', href: '#compatibility' },
    ],
    about: [
      { label: '关于我们', href: '#' },
      { label: '联系方式', href: '#' },
      { label: '隐私政策', href: '#' },
      { label: '使用条款', href: '#' },
    ],
    social: [
      { label: '微博', href: '#' },
      { label: '微信', href: '#' },
      { label: '抖音', href: '#' },
      { label: '小红书', href: '#' },
    ],
  };

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-[#212121] text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#hero');
              }}
              className="flex items-center gap-2 mb-4 group"
            >
              <Sparkles className="w-6 h-6 text-[#d4a373] group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-xl">星座屋</span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed">
              探索宇宙奥秘，解锁每日运势。让星辰指引你的人生旅程。
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-lg mb-4">导航</h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-gray-400 hover:text-[#d4a373] transition-colors text-sm relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#d4a373] transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-lg mb-4">关于</h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#d4a373] transition-colors text-sm relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#d4a373] transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">关注我们</h3>
            <ul className="space-y-3">
              {footerLinks.social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#d4a373] transition-colors text-sm relative group inline-flex items-center gap-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} 星座屋. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
