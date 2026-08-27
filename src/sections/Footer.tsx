import { BrandMark } from '../components/BrandMark';

export function Footer() {
  return (
    <footer id="site-footer" className="border-t-[3px] border-outline bg-ink px-5 py-12 text-white sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BrandMark className="h-7 w-7" />
            <span className="font-display text-lg font-black">今日运势</span>
          </div>
          <p className="mt-3 max-w-lg text-sm leading-6 text-white/60">每天一点星座灵感，轻松开启好状态。仅供娱乐与生活参考。</p>
        </div>
        <div className="text-sm text-white/45">© {new Date().getFullYear()} 今日运势</div>
      </div>
    </footer>
  );
}
