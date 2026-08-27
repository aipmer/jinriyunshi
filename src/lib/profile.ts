import type { HoroscopeFeedback, UserZodiacProfile } from '@/types';

const PROFILE_KEY = 'jinriyunshi.profile.v1';
const FEEDBACK_KEY = 'jinriyunshi.feedback.v1';

export function loadProfile(): UserZodiacProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = JSON.parse(localStorage.getItem(PROFILE_KEY) ?? 'null');
    if (!value || value.version !== 1 || typeof value.signId !== 'string') return null;
    return value as UserZodiacProfile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: Omit<UserZodiacProfile, 'version' | 'updatedAt'>): UserZodiacProfile {
  const value: UserZodiacProfile = { ...profile, version: 1, updatedAt: new Date().toISOString() };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(value));
  localStorage.setItem('selectedZodiacSign', value.signId);
  return value;
}

export function clearProfile() {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem('selectedZodiacSign');
}

export function saveFeedback(contentKey: string, feedback: HoroscopeFeedback) {
  if (typeof window === 'undefined') return;
  try {
    const values = JSON.parse(localStorage.getItem(FEEDBACK_KEY) ?? '{}') as Record<string, HoroscopeFeedback>;
    values[contentKey] = feedback;
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(values));
  } catch {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify({ [contentKey]: feedback }));
  }
}

export function getFeedback(contentKey: string): HoroscopeFeedback | null {
  if (typeof window === 'undefined') return null;
  try {
    const values = JSON.parse(localStorage.getItem(FEEDBACK_KEY) ?? '{}') as Record<string, HoroscopeFeedback>;
    return values[contentKey] ?? null;
  } catch {
    return null;
  }
}
