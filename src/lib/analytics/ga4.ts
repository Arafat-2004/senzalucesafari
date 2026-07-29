import { logger } from '@/lib/reliability/logger'

export const ANALYTICS_CONSENT_KEY = 'cookie-consent-v2'

export type AnalyticsConsent = 'analytics' | 'necessary'

export type AnalyticsEventName =
  | 'view_item'
  | 'select_item'
  | 'search'
  | 'generate_lead'
  | 'begin_checkout'
  | 'booking_completed'
  | 'purchase'
  | 'login'
  | 'sign_up'
  | 'tour_compared'
  | 'whatsapp_clicked'
  | 'phone_clicked'
  | 'email_clicked'
  | 'language_changed'
  | 'newsletter_subscribed'
  | 'booking_step_completed'
  | 'configurator_step_complete'
  | 'configurator_complete'
  | 'book_vehicle_click'
  | 'view_itinerary_click'
  | 'instagram_post_click'
  | 'instagram_profile_visit'
  | 'booking_widget_submit'

export interface AnalyticsItem {
  item_id: string
  item_name: string
  item_category?: string
  price?: number
  quantity?: number
}

export interface AnalyticsEventParams {
  tour_id?: string
  tour_name?: string
  destination?: string
  category?: string
  duration_days?: number
  value?: number
  currency?: string
  booking_step?: number
  language?: string
  contact_method?: 'whatsapp' | 'phone' | 'email' | 'form'
  search_term?: string
  result_count?: number
  item_count?: number
  method?: string
  item_list_name?: string
  vehicle_type?: string
  itinerary_name?: string
  group_size?: string
  post_id?: number
  items?: AnalyticsItem[]
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    __senzaAnalyticsDebug?: boolean
    __senzaAnalyticsReady?: boolean
    __senzaAnalyticsQueue?: Array<{ name: AnalyticsEventName; params: AnalyticsEventParams }>
  }
}

const ALLOWED_CURRENCIES = new Set(['USD', 'TZS', 'EUR', 'GBP', 'CAD', 'AUD'])
const STRING_LIMIT = 100

function containsSensitiveValue(value: string): boolean {
  return /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/i.test(value)
    || /(?:\+?\d[\d\s().-]{7,}\d)/.test(value)
    || /(?:password|passwd|token|secret|passport)\s*[:=]/i.test(value)
}

function safeString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim().slice(0, STRING_LIMIT)
  if (!normalized || containsSensitiveValue(normalized)) return undefined
  return normalized
}

function safeNumber(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return undefined
  return value
}

function safeInteger(value: unknown): number | undefined {
  const number = safeNumber(value)
  return number === undefined ? undefined : Math.round(number)
}

function sanitizeItem(item: AnalyticsItem): AnalyticsItem | null {
  const itemId = safeString(item.item_id)
  const itemName = safeString(item.item_name)
  if (!itemId || !itemName) return null

  return {
    item_id: itemId,
    item_name: itemName,
    ...(safeString(item.item_category) ? { item_category: safeString(item.item_category) } : {}),
    ...(safeNumber(item.price) !== undefined ? { price: safeNumber(item.price) } : {}),
    ...(safeInteger(item.quantity) !== undefined ? { quantity: safeInteger(item.quantity) } : {}),
  }
}

export function sanitizeAnalyticsParams(params: AnalyticsEventParams = {}): AnalyticsEventParams {
  const currency = safeString(params.currency)?.toUpperCase()
  const items = Array.isArray(params.items)
    ? params.items.map(sanitizeItem).filter((item): item is AnalyticsItem => item !== null).slice(0, 20)
    : []

  return {
    ...(safeString(params.tour_id) ? { tour_id: safeString(params.tour_id) } : {}),
    ...(safeString(params.tour_name) ? { tour_name: safeString(params.tour_name) } : {}),
    ...(safeString(params.destination) ? { destination: safeString(params.destination) } : {}),
    ...(safeString(params.category) ? { category: safeString(params.category) } : {}),
    ...(safeInteger(params.duration_days) !== undefined ? { duration_days: safeInteger(params.duration_days) } : {}),
    ...(safeNumber(params.value) !== undefined ? { value: safeNumber(params.value) } : {}),
    ...(currency && ALLOWED_CURRENCIES.has(currency) ? { currency } : {}),
    ...(safeInteger(params.booking_step) !== undefined ? { booking_step: safeInteger(params.booking_step) } : {}),
    ...(safeString(params.language) ? { language: safeString(params.language) } : {}),
    ...(params.contact_method ? { contact_method: params.contact_method } : {}),
    ...(safeString(params.search_term) ? { search_term: safeString(params.search_term) } : {}),
    ...(safeInteger(params.result_count) !== undefined ? { result_count: safeInteger(params.result_count) } : {}),
    ...(safeInteger(params.item_count) !== undefined ? { item_count: safeInteger(params.item_count) } : {}),
    ...(safeString(params.method) ? { method: safeString(params.method) } : {}),
    ...(safeString(params.item_list_name) ? { item_list_name: safeString(params.item_list_name) } : {}),
    ...(safeString(params.vehicle_type) ? { vehicle_type: safeString(params.vehicle_type) } : {}),
    ...(safeString(params.itinerary_name) ? { itinerary_name: safeString(params.itinerary_name) } : {}),
    ...(safeString(params.group_size) ? { group_size: safeString(params.group_size) } : {}),
    ...(safeInteger(params.post_id) !== undefined ? { post_id: safeInteger(params.post_id) } : {}),
    ...(items.length ? { items } : {}),
  }
}

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === 'undefined') return null
  const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY)
  return value === 'analytics' || value === 'necessary' ? value : null
}

export function isPublicAnalyticsPath(pathname = typeof window !== 'undefined' ? window.location.pathname : ''): boolean {
  return Boolean(pathname) && !pathname.startsWith('/admin')
}

export function ensureGtag(): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }
}

export function updateGoogleConsent(consent: AnalyticsConsent): void {
  if (typeof window === 'undefined') return
  ensureGtag()
  window.gtag?.('consent', 'update', {
    analytics_storage: consent === 'analytics' ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
}

export function trackAnalyticsEvent(name: AnalyticsEventName, params: AnalyticsEventParams = {}): boolean {
  const sanitized = sanitizeAnalyticsParams(params)
  const debug = process.env.NODE_ENV === 'development'
    || (typeof window !== 'undefined' && window.__senzaAnalyticsDebug === true)

  if (debug) {
    logger.info(`[GA4] ${name}`, { params: sanitized })
  }

  if (typeof window === 'undefined'
    || getAnalyticsConsent() !== 'analytics'
    || !isPublicAnalyticsPath()) {
    return false
  }

  ensureGtag()
  if (!window.__senzaAnalyticsReady) {
    window.__senzaAnalyticsQueue = window.__senzaAnalyticsQueue || []
    if (window.__senzaAnalyticsQueue.length < 100) {
      window.__senzaAnalyticsQueue.push({ name, params: sanitized })
    }
    return true
  }
  window.gtag?.('event', name, sanitized)
  return true
}

export function tourAnalyticsParams(tour: {
  id: string
  name: string
  category?: string
  duration?: string
  startEnd?: string
  priceFrom?: number
}): AnalyticsEventParams {
  const durationDays = Number.parseInt(tour.duration?.match(/\d+/)?.[0] || '', 10)
  const price = typeof tour.priceFrom === 'number' ? tour.priceFrom : undefined

  return {
    tour_id: tour.id,
    tour_name: tour.name,
    category: tour.category,
    destination: tour.startEnd,
    duration_days: Number.isFinite(durationDays) ? durationDays : undefined,
    value: price,
    currency: price === undefined ? undefined : 'USD',
    items: [{
      item_id: tour.id,
      item_name: tour.name,
      item_category: tour.category,
      price,
      quantity: 1,
    }],
  }
}
