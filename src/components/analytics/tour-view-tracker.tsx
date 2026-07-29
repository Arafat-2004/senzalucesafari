'use client'

import { useEffect, useRef } from 'react'
import { tourAnalyticsParams, trackAnalyticsEvent } from '@/lib/analytics/ga4'

interface TourViewTrackerProps {
  tour: {
    id: string
    name: string
    category?: string
    duration?: string
    startEnd?: string
    priceFrom?: number
  }
}

export function TourViewTracker({ tour }: TourViewTrackerProps) {
  const trackedTourId = useRef<string | null>(null)

  useEffect(() => {
    const trackView = () => {
      if (trackedTourId.current === tour.id) return
      if (trackAnalyticsEvent('view_item', tourAnalyticsParams(tour))) {
        trackedTourId.current = tour.id
      }
    }

    trackView()
    window.addEventListener('cookie-consent-changed', trackView)
    return () => window.removeEventListener('cookie-consent-changed', trackView)
  }, [tour])

  return null
}
