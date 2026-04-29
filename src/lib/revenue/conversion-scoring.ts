import type { FunnelEvent, AIConversionOutput, CTAPriority, PricingMode, UrgencyLevel, UpsellVisibility } from './ai-types';

export interface ConversionInput {
    tourId?: string;
    vehicleId?: string;
    deviceType: 'desktop' | 'tablet' | 'mobile';
    userBehaviorEvents: FunnelEvent[];
    sessionInteractions: number;
    pageViews: number;
    scrollDepth: number;
    timeOnPage: number;
    isReturningUser: boolean;
    priceSensitivity: 'low' | 'medium' | 'high';
}

const EVENT_WEIGHTS = {
    view: 5,
    click: 15,
    scroll: 3,
    input: 20,
    submit: 40
};

const SCROLL_THRESHOLDS = {
    low: 25,
    medium: 50,
    high: 75
};

const TIME_THRESHOLDS = {
    quick: 10000,
    moderate: 30000,
    engaged: 60000
};

function calculateEngagementScore(events: FunnelEvent[]): number {
    if (events.length === 0) return 0;
    
    return events.reduce((score, event) => {
        const baseWeight = EVENT_WEIGHTS[event.type] || 5;
        let multiplier = 1;
        
        if (event.metadata?.target === 'pricing') multiplier = 1.5;
        if (event.metadata?.target === 'cta') multiplier = 1.8;
        if (event.metadata?.target === 'dates') multiplier = 1.5;
        if (event.metadata?.target === 'upsell') multiplier = 1.3;
        
        return score + (baseWeight * multiplier);
    }, 0);
}

function calculateScrollEngagement(scrollDepth: number): number {
    if (scrollDepth >= SCROLL_THRESHOLDS.high) return 30;
    if (scrollDepth >= SCROLL_THRESHOLDS.medium) return 20;
    if (scrollDepth >= SCROLL_THRESHOLDS.low) return 10;
    return 0;
}

function calculateTimeEngagement(timeOnPage: number): number {
    if (timeOnPage >= TIME_THRESHOLDS.engaged) return 25;
    if (timeOnPage >= TIME_THRESHOLDS.moderate) return 15;
    if (timeOnPage >= TIME_THRESHOLDS.quick) return 8;
    return 0;
}

function detectHighIntentActions(events: FunnelEvent[]): boolean {
    const submitEvents = events.filter(e => e.type === 'submit');
    const ctaClicks = events.filter(e => 
        e.type === 'click' && 
        (e.metadata?.ctaType === 'book' || e.metadata?.ctaType === 'enquire')
    );
    
    return submitEvents.length > 0 || ctaClicks.length >= 2;
}

export function calculateConversionScore(input: ConversionInput): AIConversionOutput {
    const {
        userBehaviorEvents,
        sessionInteractions,
        pageViews,
        scrollDepth,
        timeOnPage,
        isReturningUser,
        priceSensitivity
    } = input;
    
    const engagementScore = calculateEngagementScore(userBehaviorEvents);
    const scrollScore = calculateScrollEngagement(scrollDepth);
    const timeScore = calculateTimeEngagement(timeOnPage);
    const interactionScore = Math.min(sessionInteractions * 3, 20);
    const pageViewScore = Math.min(pageViews * 5, 15);
    
    let totalScore = engagementScore + scrollScore + timeScore + interactionScore + pageViewScore;
    
    if (isReturningUser) totalScore += 15;
    
    if (detectHighIntentActions(userBehaviorEvents)) totalScore += 25;
    
    totalScore = Math.min(totalScore, 100);
    
    const confidence = Math.min(
        (userBehaviorEvents.length / 10) * 0.4 + 
        (scrollDepth / 100) * 0.3 + 
        (timeOnPage / TIME_THRESHOLDS.engaged) * 0.3,
        1
    );
    
    const ctaPriority = determineCTAPriority(totalScore, input.deviceType, priceSensitivity);
    const pricingMode = determinePricingMode(totalScore, priceSensitivity, input.deviceType);
    const urgencyLevel = determineUrgencyLevel(totalScore);
    const upsellVisibility = determineUpsellVisibility(totalScore);
    const recommendations = generateRecommendations(totalScore, input);
    
    return {
        conversionScore: totalScore,
        ctaPriority,
        pricingMode,
        urgencyLevel,
        upsellVisibility,
        confidence: Math.round(confidence * 100),
        recommendations
    };
}

function determineCTAPriority(
    score: number, 
    deviceType: ConversionInput['deviceType'],
    priceSensitivity: ConversionInput['priceSensitivity']
): CTAPriority {
    if (score >= 75) return 'book';
    if (score >= 40) return 'enquire';
    if (deviceType === 'mobile' && priceSensitivity === 'high') return 'whatsapp';
    return 'enquire';
}

function determinePricingMode(
    score: number,
    priceSensitivity: ConversionInput['priceSensitivity'],
    deviceType: ConversionInput['deviceType']
): PricingMode {
    if (priceSensitivity === 'high' || deviceType === 'mobile') return 'per_day';
    if (score >= 50) return 'full';
    return 'from';
}

function determineUrgencyLevel(score: number): UrgencyLevel {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
}

function determineUpsellVisibility(score: number): UpsellVisibility {
    if (score >= 60) return 'full';
    if (score >= 35) return 'partial';
    return 'none';
}

function generateRecommendations(score: number, input: ConversionInput): string[] {
    const recs: string[] = [];
    
    if (score < 30) {
        recs.push('Simplify CTA to reduce friction');
    } else if (score < 50) {
        recs.push('Show pricing details to build trust');
    }
    
    if (input.deviceType === 'mobile') {
        recs.push('Prioritize WhatsApp for mobile friction reduction');
    }
    
    if (input.priceSensitivity === 'high') {
        recs.push('Emphasize per-day pricing');
    }
    
    if (score >= 60 && input.scrollDepth >= 50) {
        recs.push('Consider upsell visibility');
    }
    
    return recs;
}

export function getDefaultConversionOutput(): AIConversionOutput {
    return {
        conversionScore: 25,
        ctaPriority: 'enquire',
        pricingMode: 'from',
        urgencyLevel: 'low',
        upsellVisibility: 'none',
        confidence: 20,
        recommendations: ['Build engagement to unlock better offers']
    };
}