import {
  ANALYTICS_CONSENT_KEY,
  sanitizeAnalyticsParams,
  trackAnalyticsEvent,
} from '@/lib/analytics/ga4'

describe('consent-aware GA4 analytics', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.history.replaceState({}, '', '/')
    window.dataLayer = []
    window.gtag = undefined
    window.__senzaAnalyticsReady = false
    window.__senzaAnalyticsQueue = []
  })

  test('removes sensitive and unsupported values from event parameters', () => {
    expect(sanitizeAnalyticsParams({
      tour_id: 'tour-1',
      search_term: 'traveller@example.com',
      value: 1850,
      currency: 'usd',
      method: 'website',
    })).toEqual({
      tour_id: 'tour-1',
      value: 1850,
      currency: 'USD',
      method: 'website',
    })
  })

  test('does not queue events without analytics consent', () => {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, 'necessary')

    expect(trackAnalyticsEvent('search', { search_term: 'safari' })).toBe(false)
    expect(window.__senzaAnalyticsQueue).toHaveLength(0)
  })

  test('queues consented events until the single GA configuration is ready', () => {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, 'analytics')

    expect(trackAnalyticsEvent('search', { search_term: 'Serengeti' })).toBe(true)
    expect(window.__senzaAnalyticsQueue).toEqual([
      { name: 'search', params: { search_term: 'Serengeti' } },
    ])
  })

  test('excludes admin pages from public analytics', () => {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, 'analytics')
    window.history.replaceState({}, '', '/admin/login')

    expect(trackAnalyticsEvent('login', { method: 'password' })).toBe(false)
    expect(window.__senzaAnalyticsQueue).toHaveLength(0)
  })
})
