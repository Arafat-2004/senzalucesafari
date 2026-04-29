import { Vehicle } from "@/generated/prisma/client";

type VehicleCategory = "safari" | "transfer";
type Season = "peak" | "shoulder" | "low" | "standard";

interface PricingContext {
    category?: VehicleCategory;
    demandSignal?: {
        rating: number;
        reviewCount: number;
    };
    season?: Season;
    overridePrice?: number;
}

interface PricingOutput {
    basePrice: number;
    displayPrice: number;
    perDayPrice: number;
    fromLabel: string;
    perDayLabel: string;
    urgencyLabel: string;
    urgencyLevel: "high" | "medium" | "normal";
    season: Season;
    multiplier: number;
    source: "cms-override" | "calculated" | "fallback";
    debug?: {
        priceRangeInput: string | null;
        computedBase: number;
        seasonalApplied: number;
        demandApplied: number;
    };
}

const SEASONAL_MULTIPLIERS: Record<Season, number> = {
    peak: 1.25,
    shoulder: 1.1,
    standard: 1.0,
    low: 0.95
};

const PRICE_TIERS: Record<string, number> = {
    "Premium": 500,
    "Standard": 350,
    "Budget": 250,
    "Luxury Safari Vehicle": 500,
    "Standard Safari Vehicle": 350,
    "Budget Safari Vehicle": 250,
    "Transfer Vehicle": 150
};

const BOUNDS = {
    minFloor: 0.9,
    maxCeiling: 1.35
};

export function getCurrentSeason(): Season {
    const month = new Date().getMonth() + 1;
    if (month >= 6 && month <= 8) return "peak";
    if ([5, 9, 12, 1].includes(month)) return "shoulder";
    if ([4, 11].includes(month)) return "low";
    return "standard";
}

function getCategoryFromVehicle(vehicle: Pick<Vehicle, "category" | "bestFor">): VehicleCategory {
    const cat = vehicle.category?.toLowerCase() || "";
    if (cat.includes("transfer") || cat.includes("airport")) return "transfer";
    if (cat.includes("safari") || cat.includes("vehicle")) return "safari";
    return "safari";
}

function calculateBasePrice(vehicle: Pick<Vehicle, "priceRange" | "category">, context?: Partial<PricingContext>): number {
    if (context?.overridePrice) return context.overridePrice;
    
    const priceRange = vehicle.priceRange;
    if (priceRange && PRICE_TIERS[priceRange]) {
        return PRICE_TIERS[priceRange];
    }
    
    if (priceRange && priceRange.trim()) {
        const numMatch = priceRange.match(/\$?(\d+)/);
        if (numMatch) return parseInt(numMatch[1]);
    }
    
    return PRICE_TIERS[vehicle.category] || 350;
}

function calculateSeasonalMultiplier(season: Season): number {
    return SEASONAL_MULTIPLIERS[season] || 1.0;
}

function calculateDemandAdjustment(rating?: number, reviewCount?: number): number {
    if (!rating || !reviewCount) return 0;
    
    let adjustment = 0;
    if (rating >= 4.5 && reviewCount >= 50) adjustment = 0.08;
    else if (rating >= 4.2 && reviewCount >= 30) adjustment = 0.05;
    else if (rating >= 4.0 && reviewCount >= 20) adjustment = 0.03;
    
    return Math.min(Math.max(adjustment, -(1 - BOUNDS.minFloor)), BOUNDS.maxCeiling - 1);
}

function getUrgencyLevel(rating?: number, reviewCount?: number): "high" | "medium" | "normal" {
    if (rating && rating >= 4.5 && reviewCount && reviewCount >= 50) return "high";
    if (rating && rating >= 4.0 && reviewCount && reviewCount >= 20) return "medium";
    return "normal";
}

function getUrgencyLabel(level: "high" | "medium" | "normal"): string {
    return level === "high" ? "High Demand" : level === "medium" ? "Popular" : "";
}

function computePerDayPrice(totalPrice: number, bestFor?: string[]): number {
    const days = bestFor?.length || 3;
    return days > 0 ? Math.round(totalPrice / days) : totalPrice;
}

export function getVehicleFinalPrice(vehicle: Pick<Vehicle, "priceRange" | "category" | "rating" | "reviews" | "bestFor">, context?: PricingContext): PricingOutput {
    const category = context?.category || getCategoryFromVehicle(vehicle);
    const season = context?.season || getCurrentSeason();
    const demandSignal = context?.demandSignal || { rating: vehicle.rating || 0, reviewCount: vehicle.reviews || 0 };
    
    const basePrice = calculateBasePrice(vehicle, context || undefined);
    const seasonalMultiplier = calculateSeasonalMultiplier(season);
    const seasonalPrice = Math.round(basePrice * seasonalMultiplier);
    
    const demandAdjustment = calculateDemandAdjustment(demandSignal.rating, demandSignal.reviewCount);
    const demandAdjustedPrice = seasonalPrice * (1 + demandAdjustment);
    
    const finalPrice = Math.round(
        Math.min(
            Math.max(demandAdjustedPrice, basePrice * BOUNDS.minFloor),
            basePrice * BOUNDS.maxCeiling)
    );
    
    const urgencyLevel = getUrgencyLevel(demandSignal.rating, demandSignal.reviewCount);
    const urgencyLabel = getUrgencyLabel(urgencyLevel);
    const perDayPrice = computePerDayPrice(finalPrice, vehicle.bestFor || []);
    
    return {
        basePrice,
        displayPrice: finalPrice,
        perDayPrice,
        fromLabel: `From $${finalPrice.toLocaleString()}`,
        perDayLabel: `$${perDayPrice.toLocaleString()}/day`,
        urgencyLabel,
        urgencyLevel,
        season,
        multiplier: seasonalMultiplier,
        source: context?.overridePrice ? "cms-override" : "calculated",
        debug: {
            priceRangeInput: vehicle.priceRange,
            computedBase: basePrice,
            seasonalApplied: seasonalPrice,
            demandApplied: demandAdjustment
        }
    };
}

export function formatDisplayPrice(price: number): string {
    return `$${price.toLocaleString()}`;
}

export function formatPerDayPrice(price: number): string {
    return `$${price.toLocaleString()}/day`;
}

export function getSeasonalLabel(season: Season): string {
    const labels: Record<Season, string> = {
        peak: "Peak Season",
        shoulder: "Shoulder Season",
        standard: "Standard Season",
        low: "Low Season"
    };
    return labels[season];
}