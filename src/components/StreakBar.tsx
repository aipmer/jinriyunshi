import { useEffect, useState } from 'react';
import { recordVisit, type StreakResult } from '@/lib/streak';

const WEEK = 7;

export function StreakBar() {
  const [streak, setStreak] = useState<StreakResult | null>(null);

  useEffect(() => { setStreak(recordVisit()); }, []);

  if (!streak) return null;

  // 一周七格，满一周后从头再来，让「再来 N 天」始终有个近的目标
  const filled = streak.count % WEEK === 0 ? WEEK : streak.count % WEEK;
  const remaining = WEEK - filled;

  return (
    <div className="sticker flex items-center gap-3 bg-white px-4 py-3">
      <div className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: WEEK }, (_, index) => (
          <span key={index} className={`h-5 w-5 rounded-md border-2 border-outline ${index < filled ? 'bg-gold' : 'border-dashed border-outline/30 bg-haze'}`} />
        ))}
      </div>
      <div className="flex flex-grow flex-col items-end gap-0.5">
        <span className="font-display text-sm font-black leading-none text-ink">连击 {streak.count} 天</span>
        <span className="text-xs leading-none text-ink/55">
          {streak.brokeFrom > 0 ? `上次连到 ${streak.brokeFrom} 天` : remaining > 0 ? `再来 ${remaining} 天满一周` : '整整一周，稳'}
        </span>
      </div>
    </div>
  );
}
