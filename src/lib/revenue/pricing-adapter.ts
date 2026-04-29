import type { PricingMode } from './ai-types';
import { getVehicleFinalPrice, formatDisplayPrice, getCurrentSeason } from './pricing-governance';

export interface PricingDisplayConfig {
    primaryLabel: string;
    secondaryLabel?: string;
    showSavings: boolean;
    showPerDay: boolean;
    highlightDeal: boolean;
}

const SEASONAL_LABELS: Record<string, { primary: string; secondary?: string }> = {
    peak: { primary: 'Peak Season', secondary: 'Premium Pricing' },
    shoulder: { primary: 'Shoulder Season', secondary: 'Great Value' },
    low: { primary: 'Low Season', secondary: 'Best Deals' }
};

export function getAIAdjustedPricingDisplay(
    vehicleOrTourId: string,
    conversionScore: number,
    pricingMode: PricingMode
): PricingDisplayConfig {
    const season = getCurrentSeason();
    const seasonalInfo = SEASONAL_LABELS[season] || SEASONAL_LABELS['shoulder'];
    
    let display: PricingDisplayConfig;
    
    if (conversionScore >= 70) {
        display = {
            primaryLabel: seasonalInfo.primary,
            secondaryLabel: seasonalInfo.secondary,
            showSavings: season === 'low',
            showPerDay: pricingMode === 'per_day',
            highlightDeal: season === 'low'
        };
    } else if (conversionScore >= 40) {
        display = {
            primaryLabel: seasonalInfo.primary,
            showSavings: false,
            showPerDay: pricingMode === 'per_day',
            highlightDeal: false
        };
    } else {
        display = {
            primaryLabel: 'From',
            showSavings: false,
            showPerDay: false,
            highlightDeal: false
        };
    }
    
    return display;
}

export function getFormattedPrice(
    basePrice: number,
    pricingMode: PricingMode,
    duration?: number
): string {
    if (pricingMode === 'per_day' && duration && duration > 1) {
        const perDay = Math.round(basePrice / duration);
        return `$${perDay.toLocaleString()}/day`;
    }
    
    return formatDisplayPrice(basePrice);
}

export function getSmartPriceHints(
    vehicleId: string,
    conversionScore: number,
    isMobile: boolean
): { hint: string; showBadge: boolean } {
    const season = getCurrentSeason();
    
    if (conversionScore >= 70 && season === 'low') {
        return { 
            hint: 'Best time to book! Up to 20% off.', 
            showBadge: true 
        };
    }
    
    if (conversionScore >= 50 && isMobile) {
        return { 
            hint: 'Mobile exclusive: Easy booking in 3 taps.', 
            showBadge: false 
        };
    }
    
    if (conversionScore >= 40) {
        return { 
            hint: '✓ Free cancellation • Best price guarantee', 
            showBadge: false 
        };
    }
    
    return { hint: '', showBadge: false };
}

export function adaptPriceForDisplay(
    price: number,
    mode: PricingMode,
    conversionScore: number,
    duration?: number
): {
    display: string;
    label: string;
    badge?: string;
} {
    const formatted = getFormattedPrice(price, mode, duration);
    
    let label = 'From';
    let badge: string | undefined;
    
    if (conversionScore >= 70) {
        label = 'Special Offer';
        if (mode === 'per_day') label = 'Per Day';
    } else if (conversionScore >= 50) {
        label = mode === 'per_day' ? 'Per Day' : 'From';
    }
    
    return { display: formatted, label, badge };
}