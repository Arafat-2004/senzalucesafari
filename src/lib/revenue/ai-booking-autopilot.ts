import type { FunnelEvent, AIConversionOutput, CTAPriority, PricingMode, UrgencyLevel, UpsellVisibility } from './ai-types';
import { calculateConversionScore, getDefaultConversionOutput } from './conversion-scoring';
import { getCTAStrategy, getCTADisplayConfig, type CTAStrategy } from './cta-strategy-engine';
import { getAIAdjustedPricingDisplay, getSmartPriceHints, adaptPriceForDisplay } from './pricing-adapter';
import { trackAIEvent, trackConversionPrediction, trackCTASelection, detectDropOffRisk } from './ai-event-tracker';

export interface AutopilotConfig {
    autoTrackEvents: boolean;
    enableDropOffDetection: boolean;
    minConfidence: number;
}

const DEFAULT_AUTOPILOT_CONFIG: AutopilotConfig = {
    autoTrackEvents: true,
    enableDropOffDetection: true,
    minConfidence: 30
};

export interface AutopilotDecision {
    ctaStrategy: CTAStrategy;
    pricingDisplay: ReturnType<typeof getAIAdjustedPricingDisplay>;
    urgencyLevel: UrgencyLevel;
    upsellVisibility: UpsellVisibility;
    priceHints: ReturnType<typeof getSmartPriceHints>;
    isAtRisk: boolean;
    riskLevel: 'low' | 'medium' | 'high';
}

let sessionEvents: FunnelEvent[] = [];
let lastEventTime = 0;

export function initAutopilotSession(): void {
    sessionEvents = [];
    lastEventTime = Date.now();
}

export function recordUserEvent(
    eventName: string,
    eventType: FunnelEvent['type'],
    metadata?: Record<string, unknown>
): void {
    sessionEvents.push({
        name: eventName,
        type: eventType,
        timestamp: Date.now(),
        metadata
    });
    lastEventTime = Date.now();
}

export function autopilotDecision({
    tourId,
    vehicleId,
    deviceType = 'desktop',
    isMobile = false,
    scrollDepth = 0,
    timeOnPage = 0,
    isReturningUser = false,
    priceSensitivity = 'medium',
    basePrice = 0,
    duration,
    config = DEFAULT_AUTOPILOT_CONFIG
}: {
    tourId?: string;
    vehicleId?: string;
    deviceType?: 'desktop' | 'tablet' | 'mobile';
    isMobile?: boolean;
    scrollDepth?: number;
    timeOnPage?: number;
    isReturningUser?: boolean;
    priceSensitivity?: 'low' | 'medium' | 'high';
    basePrice?: number;
    duration?: number;
    config?: AutopilotConfig;
}): AutopilotDecision {
    const input = {
        tourId,
        vehicleId,
        deviceType,
        userBehaviorEvents: sessionEvents,
        sessionInteractions: sessionEvents.filter(e => e.type === 'click').length,
        pageViews: 1,
        scrollDepth,
        timeOnPage,
        isReturningUser,
        priceSensitivity
    };
    
    const conversionOutput = calculateConversionScore(input);
    
    if (config.autoTrackEvents) {
        trackConversionPrediction(
            conversionOutput.conversionScore,
            conversionOutput.confidence,
            { tourId, vehicleId }
        );
    }
    
    const ctaStrategy = getCTAStrategy(
        conversionOutput.ctaPriority,
        isMobile,
        conversionOutput.conversionScore
    );
    
    const pricingDisplay = getAIAdjustedPricingDisplay(
        vehicleId || tourId || '',
        conversionOutput.conversionScore,
        conversionOutput.pricingMode
    );
    
    const urgencyLevel = conversionOutput.urgencyLevel;
    const upsellVisibility = conversionOutput.upsellVisibility;
    
    const priceHints = getSmartPriceHints(
        vehicleId || tourId || '',
        conversionOutput.conversionScore,
        isMobile
    );
    
    let isAtRisk = false;
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    
    if (config.enableDropOffDetection) {
        const dropOff = detectDropOffRisk(sessionEvents, Date.now() - lastEventTime);
        isAtRisk = dropOff.isAtRisk;
        riskLevel = dropOff.riskLevel;
    }
    
    return {
        ctaStrategy,
        pricingDisplay,
        urgencyLevel,
        upsellVisibility,
        priceHints,
        isAtRisk,
        riskLevel
    };
}

export function getAutopilotDecision(
    tourId: string,
    sessionData: {
        deviceType: 'desktop' | 'tablet' | 'mobile';
        scrollDepth: number;
        timeOnPage: number;
        isReturningUser: boolean;
    },
    config?: Partial<AutopilotConfig>
): AutopilotDecision {
    return autopilotDecision({
        tourId,
        ...sessionData,
        config: { ...DEFAULT_AUTOPILOT_CONFIG, ...config }
    });
}

export function selectAutopilotCTA(
    ctaType: 'book' | 'enquire' | 'whatsapp',
    conversionScore: number
): void {
    trackCTASelection(ctaType, conversionScore);
}

export function getConversionInsights(): {
    totalEvents: number;
    engagementScore: number;
    lastEventAge: number;
    isAtRisk: boolean;
} {
    const engagementScore = sessionEvents.reduce((score, event) => {
        const weights = { view: 5, click: 15, scroll: 3, input: 20, submit: 40 };
        return score + (weights[event.type] || 5);
    }, 0);
    
    return {
        totalEvents: sessionEvents.length,
        engagementScore,
        lastEventAge: Date.now() - lastEventTime,
        isAtRisk: sessionEvents.length === 0 || (Date.now() - lastEventTime) > 60000
    };
}