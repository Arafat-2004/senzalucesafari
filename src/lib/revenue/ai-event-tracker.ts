import type { FunnelEvent } from './ai-types';
import { logger } from "@/lib/reliability/logger";

export interface AIEventPayload {
    eventType: 'ai_recommendation' | 'conversion_prediction' | 'upsell_shown' | 'upsell_accepted' | 'drop_off_risk' | 'cta_selection';
    score?: number;
    metadata?: Record<string, unknown>;
    timestamp: number;
}

const aiEventBuffer: AIEventPayload[] = [];

export function trackAIEvent(
    eventType: AIEventPayload['eventType'],
    payload?: Omit<AIEventPayload, 'eventType' | 'timestamp'>
): void {
    const event: AIEventPayload = {
        eventType,
        ...payload,
        timestamp: Date.now()
    };
    
    aiEventBuffer.push(event);
    
    if (aiEventBuffer.length > 50) {
        aiEventBuffer.shift();
    }
    
    if (process.env.NODE_ENV === 'development') {
        logger.info(`[AI] ${eventType}`, { payload });
    }
}

export function trackConversionPrediction(
    score: number,
    confidence: number,
    details?: Record<string, unknown>
): void {
    trackAIEvent('conversion_prediction', {
        score,
        metadata: { confidence, ...details }
    });
}

export function trackUpsellDecision(
    upsellType: string,
    shown: boolean,
    accepted: boolean,
    reason?: string
): void {
    if (shown) {
        trackAIEvent('upsell_shown', {
            metadata: { upsellType, reason }
        });
    }
    if (accepted) {
        trackAIEvent('upsell_accepted', {
            metadata: { upsellType, reason }
        });
    }
}

export function trackCTASelection(
    ctaType: 'book' | 'enquire' | 'whatsapp',
    conversionScore: number
): void {
    trackAIEvent('cta_selection', {
        score: conversionScore,
        metadata: { ctaType }
    });
}

export function detectDropOffRisk(
    events: FunnelEvent[],
    timeSinceLastEvent: number
): { isAtRisk: boolean; riskLevel: 'low' | 'medium' | 'high'; reason: string } {
    const lastEvent = events[events.length - 1];
    
    if (!lastEvent) {
        return { isAtRisk: true, riskLevel: 'high', reason: 'No user events recorded' };
    }
    
    const timeSinceLast = timeSinceLastEvent || (Date.now() - lastEvent.timestamp);
    
    if (timeSinceLast > 120000) {
        return { isAtRisk: true, riskLevel: 'high', reason: 'User inactive for 2+ minutes' };
    }
    
    const ctaClickEvents = events.filter(e => 
        e.type === 'click' && e.metadata?.ctaType
    );
    
    if (ctaClickEvents.length >= 3 && timeSinceLast > 30000) {
        return { isAtRisk: true, riskLevel: 'medium', reason: 'Multiple CTA clicks but no submission' };
    }
    
    if (timeSinceLast > 60000) {
        return { isAtRisk: true, riskLevel: 'medium', reason: 'User inactive for 1+ minute' };
    }
    
    return { isAtRisk: false, riskLevel: 'low', reason: 'Active engagement' };
}

export function getRecentAIEvents(limit = 10): AIEventPayload[] {
    return aiEventBuffer.slice(-limit);
}

export function clearAIEventBuffer(): void {
    aiEventBuffer.length = 0;
}