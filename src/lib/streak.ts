import { toDateKey } from '@/data/zodiac';

const STREAK_KEY = 'jinriyunshi.streak.v1';

export interface StreakState {
  /** 最近一次到访的日期，YYYY-MM-DD */
  last: string;
  /** 当前连续天数 */
  count: number;
  /** 历史最长连续天数 */
  best: number;
}

export interface StreakResult extends StreakState {
  /** 今天是否第一次记录（用于只在首次到访时做入场动画） */
  isFirstToday: boolean;
  /** 断签前的连续天数；没断签时为 0 */
  brokeFrom: number;
}

function read(): StreakState | null {
  try {
    const value = JSON.parse(localStorage.getItem(STREAK_KEY) ?? 'null');
    if (!value || typeof value.last !== 'string' || typeof value.count !== 'number') return null;
    return { last: value.last, count: value.count, best: typeof value.best === 'number' ? value.best : value.count };
  } catch {
    return null;
  }
}

function shiftDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/**
 * 记一次到访并返回连击状态。同一天重复调用不会重复计数。
 * 只写 localStorage，不需要登录，也不上传任何东西。
 */
export function recordVisit(today: Date = new Date()): StreakResult | null {
  if (typeof window === 'undefined') return null;
  const todayKey = toDateKey(today);
  const yesterdayKey = toDateKey(shiftDays(today, -1));
  const previous = read();

  if (previous?.last === todayKey) {
    return { ...previous, isFirstToday: false, brokeFrom: 0 };
  }

  const continued = previous?.last === yesterdayKey;
  const count = continued ? previous.count + 1 : 1;
  const brokeFrom = !continued && previous && previous.count > 1 ? previous.count : 0;
  const state: StreakState = { last: todayKey, count, best: Math.max(count, previous?.best ?? 0) };

  try { localStorage.setItem(STREAK_KEY, JSON.stringify(state)); } catch { /* 隐私模式下写不进去，不影响展示 */ }
  return { ...state, isFirstToday: true, brokeFrom };
}
