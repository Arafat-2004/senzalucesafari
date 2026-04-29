import type { CTAPriority } from './ai-types';

export interface CTAStrategy {
    primary: 'book' | 'enquire' | 'whatsapp';
    secondary: Array<{ label: string; action: string }>;
    showPrice: boolean;
    highlightIntensity: 'none' | 'subtle' | 'strong';
}

export interface CTADisplayConfig {
    ctaPriority: CTAPriority;
    showUpsells: boolean;
    pricingLabel: string;
    urgencyBadge: boolean;
}

export const DEFAULT_CTA_STRATEGY: CTAStrategy = {
    primary: 'enquire',
    secondary: [
        { label: 'Book Now', action: 'book' },
        { label: 'WhatsApp', action: 'whatsapp' }
    ],
    showPrice: true,
    highlightIntensity: 'none'
};

const HIGH_INTENT_STRATEGY: CTAStrategy = {
    primary: 'book',
    secondary: [
        { label: 'Enquire', action: 'enquire' },
        { label: 'WhatsApp', action: 'whatsapp' }
    ],
    showPrice: true,
    highlightIntensity: 'strong'
};

const MEDIUM_INTENT_STRATEGY: CTAStrategy = {
    primary: 'enquire',
    secondary: [
        { label: 'Book Now', action: 'book' },
        { label: 'WhatsApp', action: 'whatsapp' }
    ],
    showPrice: true,
    highlightIntensity: 'subtle'
};

const LOW_INTENT_STRATEGY: CTAStrategy = {
    primary: 'enquire',
    secondary: [
        { label: 'Enquire', action: 'enquire' },
        { label: 'WhatsApp', action: 'whatsapp' }
    ],
    showPrice: true,
    highlightIntensity: 'none'
};

const MOBILE_LOW_FRICTION_STRATEGY: CTAStrategy = {
    primary: 'whatsapp',
    secondary: [
        { label: 'Enquire', action: 'enquire' },
        { label: 'Book Now', action: 'book' }
    ],
    showPrice: true,
    highlightIntensity: 'none'
};

export function getCTAStrategy(
    ctaPriority: CTAPriority,
    isMobile: boolean,
    conversionScore: number
): CTAStrategy {
    if (isMobile && conversionScore < 40) {
        return MOBILE_LOW_FRICTION_STRATEGY;
    }
    
    switch (ctaPriority) {
        case 'book':
            return HIGH_INTENT_STRATEGY;
        case 'enquire':
            return conversionScore >= 40 ? MEDIUM_INTENT_STRATEGY : LOW_INTENT_STRATEGY;
        case 'whatsapp':
            return MOBILE_LOW_FRICTION_STRATEGY;
        default:
            return DEFAULT_CTA_STRATEGY;
    }
}

export function getCTADisplayConfig(
    ctaPriority: CTAPriority,
    conversionScore: number,
    urgencyLevel: 'low' | 'medium' | 'high',
    upsellVisibility: 'none' | 'partial' | 'full'
): CTADisplayConfig {
    return {
        ctaPriority,
        showUpsells: upsellVisibility === 'full' || (upsellVisibility === 'partial' && conversionScore >= 50),
        pricingLabel: getPricingLabel(conversionScore),
        urgencyBadge: urgencyLevel === 'high' || (urgencyLevel === 'medium' && conversionScore >= 60)
    };
}

function getPricingLabel(score: number): string {
    if (score >= 60) return 'Best Value';
    if (score >= 40) return 'From';
    return 'From';
}

export function formatPriceWithAI(
    basePrice: number,
    pricingMode: 'from' | 'per_day' | 'full',
    duration?: number
): string {
    if (pricingMode === 'per_day' && duration && duration > 0) {
        return `$${Math.round(basePrice / duration)}/day`;
    }
    return `$${basePrice.toLocaleString()}`;
}