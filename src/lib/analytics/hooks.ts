"use client";

import { useCallback } from 'react';

export interface FunnelEvent {
    name: string;
    data?: Record<string, unknown>;
    timestamp: number;
}

const eventBuffer: FunnelEvent[] = [];

export const useAnalytics = () => {
    const trackEvent = useCallback(async (eventName: string, eventData?: Record<string, unknown>) => {
        const event: FunnelEvent = {
            name: eventName,
            data: eventData as Record<string, unknown>,
            timestamp: Date.now()
        };
        
        eventBuffer.push(event);
        
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Analytics] ${eventName}`, eventData || {});
        }

        if (typeof window !== 'undefined' && (window as unknown as { gtag?: unknown }).gtag) {
            ((window as unknown as { gtag: (event: string, name: string, data?: Record<string, unknown>) => void }).gtag)('event', eventName, eventData as Record<string, unknown>);
        }

        if (typeof window !== 'undefined') {
            try {
                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        eventName,
                        eventType: 'custom',
                        page: window.location.pathname,
                        metadata: eventData,
                    }),
                });
            } catch (e) {
                console.warn('[Analytics] Failed to persist event:', e);
            }
        }
    }, []);

    const trackCTA = useCallback(async (ctaType: string, context: string, tourId?: string) => {
        const page = typeof window !== 'undefined' ? window.location.pathname : 'unknown';
        
        if (typeof window !== 'undefined') {
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
                        metadata: {},
                    }),
                });
            } catch (e) {
                console.warn('[Analytics] Failed to persist CTA:', e);
            }
        }

        trackEvent(`cta_${ctaType}`, {
            context,
            tourId,
            page,
        });
    }, [trackEvent]);

    const trackFunnelStage = useCallback((stage: string, metadata?: Record<string, unknown>) => {
        trackEvent(`funnel_${stage}`, {
            stage,
            ...metadata
        });
    }, [trackEvent]);

    const getEvents = useCallback(() => {
        return [...eventBuffer];
    }, []);

    const clearEvents = useCallback(() => {
        eventBuffer.length = 0;
    }, []);

    return {
        trackEvent,
        trackCTA,
        trackFunnelStage,
        getEvents,
        clearEvents
    };
};

export const ANALYTICS_EVENTS = {
    CTA_BOOK_CLICK: 'book_click',
    CTA_COMPARE_TOGGLE: 'compare_toggle',
    CTA_ENQUIRE_CLICK: 'enquire_click',
    CTA_WHATSAPP_CLICK: 'whatsapp_click',
    TOUR_VIEW: 'tour_view',
    TOUR_DETAIL_VIEW: 'tour_detail_view',
    COMPARE_OPEN: 'compare_open',
    COMPARE_CLOSE: 'compare_close',
    BOOKING_START: 'booking_start',
    BOOKING_SUBMIT: 'booking_submit',
    ENQUIRY_SUBMIT: 'enquiry_submit',
    SEARCH_QUERY: 'search_query',
    FILTER_CHANGE: 'filter_change'
} as const;