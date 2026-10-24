/**
 * Analytics & Conversion Tracking
 * 
 * Vorbereitung für A/B-Testing und Conversion-Tracking
 * Kann mit Google Analytics, Facebook Pixel, etc. erweitert werden
 */

// Event Types für Conversion Tracking
export type AnalyticsEvent = 
  | 'cta_click'
  | 'form_submit'
  | 'trial_booking'
  | 'membership_signup'
  | 'page_view'
  | 'scroll_depth'
  | 'time_on_page';

export interface AnalyticsEventData {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: unknown;
}

declare global {
  interface Window {
    gtag?: (command: 'event', name: AnalyticsEvent, data: AnalyticsEventData) => void;
    fbq?: (command: 'track', name: 'CustomEvent', data: AnalyticsEventData) => void;
  }
}

/**
 * Track Analytics Event
 * 
 * @param eventName - Name des Events
 * @param eventData - Zusätzliche Event-Daten
 */
export function trackEvent(eventName: AnalyticsEvent, eventData?: AnalyticsEventData) {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...eventData,
      event_category: eventData?.event_category || 'engagement',
    });
  }

  // Facebook Pixel (optional)
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'CustomEvent', {
      eventName,
      ...eventData,
    });
  }

  // Console Log für Development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, eventData);
  }
}

/**
 * Track CTA Click
 */
export function trackCTAClick(label: string, location: string) {
  trackEvent('cta_click', {
    event_label: label,
    event_category: 'cta',
    location,
  });
}

/**
 * Track Form Submit
 */
export function trackFormSubmit(formName: string) {
  trackEvent('form_submit', {
    event_label: formName,
    event_category: 'form',
  });
}

/**
 * Track Trial Booking
 */
export function trackTrialBooking() {
  trackEvent('trial_booking', {
    event_category: 'conversion',
    value: 1,
  });
}

/**
 * Track Membership Signup
 */
export function trackMembershipSignup(membershipType: string) {
  trackEvent('membership_signup', {
    event_category: 'conversion',
    event_label: membershipType,
    value: 100, // Beispiel-Wert
  });
}

/**
 * Track Page View
 */
export function trackPageView(pageName: string) {
  trackEvent('page_view', {
    event_label: pageName,
    event_category: 'navigation',
  });
}

