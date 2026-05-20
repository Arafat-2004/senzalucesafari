"use client";

import { useCallback } from 'react';
import { logger } from '@/lib/reliability/logger';

// Analytics Tracking Hook
export const useAnalytics = () => {
    const trackEvent = useCallback((eventName: string, eventData?: Record<string, unknown>) => {
        // Development logging (replaceable with Google Analytics)
        if (process.env.NODE_ENV === 'development') {
            logger.info(`[Analytics] ${eventName}`, { eventData: eventData || {} });
        }

        // Google Analytics integration (uncomment when GA is set up):
        // if (typeof window !== 'undefined' && window.gtag) {
        //     window.gtag('event', eventName, eventData);
        // }

        // Alternative: Send to custom analytics endpoint
        // fetch('/api/analytics', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ event: eventName, data: eventData })
        // });
    }, []);

    return { trackEvent };
};
