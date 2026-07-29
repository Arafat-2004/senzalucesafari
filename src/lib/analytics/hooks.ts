'use client'

import { useCallback } from 'react'
import { logger } from '@/lib/reliability/logger'
import {
  getAnalyticsConsent,
  sanitizeAnalyticsParams,
  trackAnalyticsEvent,
  type AnalyticsEventName,
  type AnalyticsEventParams,
} from '@/lib/analytics/ga4'

export const useAnalytics = () => {
  const trackEvent = useCallback((eventName: AnalyticsEventName, eventData?: AnalyticsEventParams) => {
    return trackAnalyticsEvent(eventName, eventData)
  }, [])

  const trackCTA = useCallback(async (ctaType: string, context: string, tourId?: string) => {
    if (getAnalyticsConsent() !== 'analytics') return

    const page = window.location.pathname
    const safeMetadata = sanitizeAnalyticsParams({ tour_id: tourId, category: context })

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: `cta_${ctaType}`,
          eventType: 'cta',
          context,
          tourId,
          page,
          metadata: safeMetadata,
        }),
        keepalive: true,
      })
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        logger.warn('[Analytics] Failed to persist CTA', {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }
  }, [])

  const trackFunnelStage = useCallback((stage: string, metadata?: AnalyticsEventParams) => {
    const bookingStep = Number.parseInt(stage, 10)
    return trackAnalyticsEvent('booking_step_completed', {
      ...metadata,
      booking_step: Number.isFinite(bookingStep) ? bookingStep : metadata?.booking_step,
    })
  }, [])

  return { trackEvent, trackCTA, trackFunnelStage }
}

export const ANALYTICS_EVENTS = {
  TOUR_VIEW: 'view_item',
  TOUR_SELECTED: 'select_item',
  SEARCH: 'search',
  LEAD_GENERATED: 'generate_lead',
  BOOKING_START: 'begin_checkout',
  BOOKING_COMPLETE: 'booking_completed',
  TOUR_COMPARED: 'tour_compared',
} as const satisfies Record<string, AnalyticsEventName>
