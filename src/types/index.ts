export interface ZodiacSign {
  id: string;
  name: string;
  dateRange: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  icon: string;
}

export interface HoroscopeData {
  overall: number;
  love: number;
  career: number;
  health: number;
  wealth: number;
  luckyColor: string;
  luckyNumber: number;
  luckyTime: string;
  description: string;
  advice: string;
}

export interface CompatibilityResult {
  score: number;
  description: string;
  tags: string[];
}

export type HoroscopeCategory = 'love' | 'career' | 'health' | 'wealth';

export interface DailyQuote {
  text: string;
  author: string;
  sign?: string;
}
