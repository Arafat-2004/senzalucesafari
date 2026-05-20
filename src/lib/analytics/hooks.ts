"use client";

import { useCallback, useEffect } from 'react';
import { logger } from "@/lib/reliability/logger";

export interface FunnelEvent {
    name: string;
    data?: Record<string, unknown>;
    timestamp: number;
}

const MAX_BUFFER_SIZE = 100;
const FLUSH_INTERVAL_MS = 30_000;

const eventBuffer: FunnelEvent[] = [];

async function flushBuffer() {
    if (eventBuffer.length === 0 || typeof window === 'undefined') return;
    const events = eventBuffer.splice(0, eventBuffer.length);
    try {
        await fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ events }),
        });
    } catch {
        eventBuffer.unshift(...events);
    }
}

export const useAnalytics = () => {
    useEffect(() => {
        const timer = setInterval(flushBuffer, FLUSH_INTERVAL_MS);
        const onBeforeUnload = () => {
            if (eventBuffer.length > 0 && navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify({ events: eventBuffer.splice(0, eventBuffer.length) })], { type: 'application/json' });
                navigator.sendBeacon('/api/analytics/track', blob);
            }
        };
        window.addEventListener('beforeunload', onBeforeUnload);
        return () => {
            clearInterval(timer);
            window.removeEventListener('beforeunload', onBeforeUnload);
            flushBuffer();
        };
    }, []);

    const trackEvent = useCallback(async (eventName: string, eventData?: Record<string, unknown>) => {
        if (eventBuffer.length >= MAX_BUFFER_SIZE) {
            eventBuffer.splice(0, eventBuffer.length - MAX_BUFFER_SIZE + 1);
        }
        const event: FunnelEvent = {
            name: eventName,
            data: eventData as Record<string, unknown>,
            timestamp: Date.now()
        };
        
        eventBuffer.push(event);
        
        if (process.env.NODE_ENV === 'development') {
            logger.info(`[Analytics] ${eventName}`, { eventData: eventData || {} });
        }

        if (typeof window !== 'undefined' && (window as unknown as { gtag?: unknown }).gtag) {
            ((window as unknown as { gtag: (event: string, name: string, data?: Record<string, unknown>) => void }).gtag)('event', eventName, eventData as Record<string, unknown>);
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
                logger.warn('[Analytics] Failed to persist CTA', { error: e instanceof Error ? e.message : String(e) });
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