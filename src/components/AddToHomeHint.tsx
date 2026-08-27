import { useEffect, useState } from 'react';
import { Share, X } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

const DISMISS_KEY = 'jinriyunshi.a2hs-dismissed.v1';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function AddToHomeHint() {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;
    // 已经装成 PWA 打开的就不用再提示
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);

    // iOS Safari 不支持 beforeinstallprompt，只能给一句手动指引
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);
    if (isIos && isSafari) setShowIosHint(true);

    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setPrompt(null);
    setShowIosHint(false);
  };

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    trackEvent('add_to_home_prompted', { outcome });
    dismiss();
  };

  if (!prompt && !showIosHint) return null;

  return (
    <div className="sticker flex items-center gap-3 bg-cream px-4 py-3">
      <Share className="h-5 w-5 flex-shrink-0 text-ink" strokeWidth={2.4} aria-hidden="true" />
      <p className="flex-grow text-xs leading-6 text-ink/80">
        {prompt ? '把今日运势加到主屏，明天一步打开。' : '点底部分享按钮，选「添加到主屏幕」，明天一步打开。'}
      </p>
      {prompt && <button type="button" onClick={install} className="sticker-btn-sm min-h-11 cursor-pointer bg-gold px-4 text-xs font-black text-ink">添加</button>}
      <button type="button" onClick={dismiss} aria-label="不再提示" className="min-h-11 w-8 cursor-pointer text-ink/45">
        <X className="mx-auto h-4 w-4" strokeWidth={2.6} />
      </button>
    </div>
  );
}
