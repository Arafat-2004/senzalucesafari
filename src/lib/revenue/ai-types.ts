export type CTAPriority = 'book' | 'enquire' | 'whatsapp';
export type PricingMode = 'from' | 'per_day' | 'full';
export type UrgencyLevel = 'low' | 'medium' | 'high';
export type UpsellVisibility = 'none' | 'partial' | 'full';

export interface AIConversionInput {
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

export interface FunnelEvent {
    name: string;
    type: 'view' | 'click' | 'scroll' | 'input' | 'submit';
    timestamp: number;
    metadata?: Record<string, unknown>;
}

export interface AIConversionOutput {
    conversionScore: number;
    ctaPriority: CTAPriority;
    pricingMode: PricingMode;
    urgencyLevel: UrgencyLevel;
    upsellVisibility: UpsellVisibility;
    confidence: number;
    recommendations: string[];
}

export interface FunnelEvent {
    name: string;
    type: 'view' | 'click' | 'scroll' | 'input' | 'submit';
    timestamp: number;
    metadata?: Record<string, unknown>;
}