"use client";

import { useCallback, useRef, useEffect } from 'react';
import { logger } from "@/lib/reliability/logger";

export interface AITrackingConfig {
    autoTrackScroll: boolean;
    autoTrackClicks: boolean;
    autoTrackTime: boolean;
    sessionTimeout: number;
}

const DEFAULT_CONFIG: AITrackingConfig = {
    autoTrackScroll: true,
    autoTrackClicks: true,
    autoTrackTime: true,
    sessionTimeout: 300000
};

export const useAITracking = (config: Partial<AITrackingConfig> = {}) => {
    const settings = { ...DEFAULT_CONFIG, ...config };
    const sessionStart = useRef<number>(Date.now());
    const scrollDepth = useRef<number>(0);
    const events = useRef<Array<{ type: string; name: string; timestamp: number; data?: unknown }>>([]);
    const isReturning = useRef<boolean>(false);
    
    useEffect(() => {
        const stored = sessionStorage.getItem('visited_before');
        isReturning.current = stored === 'true';
        sessionStorage.setItem('visited_before', 'true');
    }, []);
    
    const trackAIAction = useCallback((action: string, data?: unknown) => {
        const event = {
            type: 'ai_action',
            name: action,
            timestamp: Date.now(),
            data
        };
        events.current.push(event);
        
        if (process.env.NODE_ENV === 'development') {
            logger.info(`[AI Tracking] ${action}`, { data });
        }
    }, []);
    
    const trackConversionProbability = useCallback((score: number, confidence: number) => {
        trackAIAction('conversion_probability', { score, confidence });
    }, [trackAIAction]);
    
    const trackUpsellAcceptance = useCallback((offerType: string, accepted: boolean) => {
        trackAIAction('upsell_response', { offerType, accepted });
    }, [trackAIAction]);
    
    const trackBookingDropOff = useCallback((step: string, reason?: string) => {
        trackAIAction('booking_drop_off', { step, reason, timeOnPage: Date.now() - sessionStart.current });
    }, [trackAIAction]);
    
    const getAISessionData = useCallback(() => ({
        events: [...events.current],
        sessionDuration: Date.now() - sessionStart.current,
        scrollDepth: scrollDepth.current,
        isReturning: isReturning.current,
        eventCount: events.current.length
    }), []);
    
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        if (settings.autoTrackScroll) {
            const handleScroll = () => {
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPos = window.scrollY;
                const depth = Math.round((scrollPos / docHeight) * 100);
                scrollDepth.current = Math.max(scrollDepth.current, depth);
            };
            
            window.addEventListener('scroll', handleScroll, { passive: true });
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [settings.autoTrackScroll]);
    
    return {
        trackAIAction,
        trackConversionProbability,
        trackUpsellAcceptance,
        trackBookingDropOff,
        getAISessionData,
        isReturning: isReturning.current,
        sessionStart: sessionStart.current
    };
};

export const getDeviceType = (): 'desktop' | 'tablet' | 'mobile' => {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
};

export const detectPriceSensitivity = (
    clickCount: number,
    viewCount: number,
    timeOnPage: number
): 'low' | 'medium' | 'high' => {
    const priceClicks = clickCount;
    
    if (priceClicks >= 3 || timeOnPage > 60000) return 'high';
    if (priceClicks >= 1 || timeOnPage > 30000) return 'medium';
    return 'low';
};