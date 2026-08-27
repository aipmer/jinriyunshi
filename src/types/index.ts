export interface ZodiacSign {
  id: string;
  name: string;
  dateRange: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  icon: string;
}

export type HoroscopePeriod = 'daily' | 'weekly' | 'monthly';
export type HoroscopeCategory = 'love' | 'career' | 'health' | 'wealth';

export interface HoroscopeDimension {
  score: number;
  summary: string;
}

export interface HoroscopeData {
  period: HoroscopePeriod;
  dateRange: string;
  theme: string;
  summary: string;
  overall: number;
  love: number;
  career: number;
  health: number;
  wealth: number;
  dimensions: Record<HoroscopeCategory, HoroscopeDimension>;
  luckyColor: string;
  luckyNumber: number;
  luckyTime: string;
  actions: string[];
  cautions: string[];
  keyDates: string[];
  disclaimer: string;
  // Backwards-compatible aliases used by existing views.
  description: string;
  advice: string;
}

export interface CompatibilityDimension {
  score: number;
  summary: string;
}

export interface CompatibilityResult {
  score: number;
  description: string;
  tags: string[];
  dimensions: {
    chemistry: CompatibilityDimension;
    communication: CompatibilityDimension;
    emotion: CompatibilityDimension;
    longTerm: CompatibilityDimension;
  };
  strengths: string[];
  frictions: string[];
  advice: string;
}

export interface UserZodiacProfile {
  version: 1;
  signId: string;
  birthday?: string;
  interests: HoroscopeCategory[];
  /** 旧档案里可能还带着这两项，读的时候忽略即可，不要因此把档案读废 */
  defaultPeriod?: HoroscopePeriod;
  compactMode?: boolean;
  updatedAt: string;
}

export type HoroscopeFeedback = 'helpful' | 'neutral' | 'not_for_me';

