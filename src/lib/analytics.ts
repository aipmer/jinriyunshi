export type AnalyticsEventName =
  | 'zodiac_selected'
  | 'horoscope_detail_viewed'
  | 'horoscope_category_expanded'
  | 'compatibility_started'
  | 'compatibility_completed'
  | 'share_image_generated'
  | 'share_completed'
  | 'profile_saved'
  | 'period_horoscope_viewed'
  | 'horoscope_feedback'
  | 'heatmap_expanded'
  | 'add_to_home_prompted';

type EventProperties = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function getDeviceType() {
  if (typeof window === 'undefined') return 'server';
  if (window.matchMedia('(max-width: 767px)').matches) return 'mobile';
  if (window.matchMedia('(max-width: 1023px)').matches) return 'tablet';
  return 'desktop';
}

export function trackEvent(name: AnalyticsEventName, properties: EventProperties = {}) {
  if (typeof window === 'undefined') return;
  const payload = { ...properties, device_type: getDeviceType() };
  window.gtag?.('event', name, payload);
  window.dataLayer?.push({ event: name, ...payload });
}
