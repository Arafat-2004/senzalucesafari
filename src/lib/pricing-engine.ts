/**
 * Safari Package Pricing Engine
 * 
 * Calculates dynamic pricing based on:
 * - Number of travelers (group size discounts)
 * - Accommodation level (budget/luxury adjustments)
 * - Base package price
 * 
 * Industry-standard safari pricing model:
 * - Solo travelers pay highest per-person rate
 * - Larger groups receive progressive discounts
 * - Prices scale professionally and consistently
 */

export interface PricingTier {
    minTravelers: number;
    maxTravelers: number;
    discountPercent: number;
    label: string;
    description: string;
}

export interface PricingResult {
    basePrice: number;           // Original priceFrom
    travelers: number;           // Number of travelers
    discountPercent: number;     // Group discount %
    discountAmount: number;      // $ saved per person
    pricePerPerson: number;      // Final price per person
    totalPrice: number;          // Total for all travelers
    tier: string;               // Tier label
    tierDescription: string;    // Tier description
    accommodationMultiplier: number; // Accommodation level multiplier
}

export interface AccommodationLevel {
    id: string;
    label: string;
    multiplier: number; // 0.85 = -15%, 1.0 = base, 1.4 = +40%, etc.
    description: string;
}

// Group discount tiers
export const PRICING_TIERS: PricingTier[] = [
    {
        minTravelers: 1,
        maxTravelers: 1,
        discountPercent: 0,
        label: "Solo Traveler",
        description: "Base price for individual travelers"
    },
    {
        minTravelers: 2,
        maxTravelers: 2,
        discountPercent: 5,
        label: "Couple",
        description: "5% discount for 2 travelers"
    },
    {
        minTravelers: 3,
        maxTravelers: 4,
        discountPercent: 10,
        label: "Small Group",
        description: "10% discount for 3-4 travelers"
    },
    {
        minTravelers: 5,
        maxTravelers: 6,
        discountPercent: 15,
        label: "Group",
        description: "15% discount for 5-6 travelers"
    },
    {
        minTravelers: 7,
        maxTravelers: 10,
        discountPercent: 20,
        label: "Large Group",
        description: "20% discount for 7-10 travelers"
    },
    {
        minTravelers: 11,
        maxTravelers: 99,
        discountPercent: 25,
        label: "Premium Group",
        description: "25% discount for 11+ travelers (custom quote recommended)"
    }
];

// Accommodation level adjustments
export const ACCOMMODATION_LEVELS: AccommodationLevel[] = [
    {
        id: "budget",
        label: "Budget",
        multiplier: 0.85,
        description: "Comfortable lodges and campsites (-15%)"
    },
    {
        id: "mid-range",
        label: "Mid-Range",
        multiplier: 1.0,
        description: "Standard lodges and tented camps (base price)"
    },
    {
        id: "luxury",
        label: "Luxury",
        multiplier: 1.40,
        description: "Premium lodges and luxury camps (+40%)"
    },
    {
        id: "premium",
        label: "Premium",
        multiplier: 1.80,
        description: "Ultra-luxury properties and exclusive camps (+80%)"
    }
];

/**
 * Get pricing tier for a given number of travelers
 */
export function getPricingTier(travelers: number): PricingTier {
    return PRICING_TIERS.find(
        tier => travelers >= tier.minTravelers && travelers <= tier.maxTravelers
    ) || PRICING_TIERS[PRICING_TIERS.length - 1];
}

/**
 * Get accommodation level by ID
 */
export function getAccommodationLevel(id: string): AccommodationLevel {
    return ACCOMMODATION_LEVELS.find(level => level.id === id) || ACCOMMODATION_LEVELS[1]; // Default: mid-range
}

/**
 * Calculate dynamic pricing for a safari package
 * 
 * @param basePrice - The base priceFrom from tour package (for 1 person, mid-range accommodation)
 * @param travelers - Number of travelers (1-20)
 * @param accommodationLevel - Accommodation level ID (optional, defaults to mid-range)
 * @returns PricingResult with complete pricing breakdown
 */
export function calculateSafariPrice(
    basePrice: number,
    travelers: number,
    accommodationLevel: string = "mid-range"
): PricingResult {
    // Validate inputs
    if (travelers < 1) travelers = 1;
    if (travelers > 20) travelers = 20; // Max limit for standard pricing
    if (basePrice < 0) basePrice = 0;

    // Get tier and accommodation level
    const tier = getPricingTier(travelers);
    const accommodation = getAccommodationLevel(accommodationLevel);

    // Calculate prices
    const priceWithAccommodation = basePrice * accommodation.multiplier;
    const discountAmount = priceWithAccommodation * (tier.discountPercent / 100);
    const pricePerPerson = priceWithAccommodation - discountAmount;
    const totalPrice = pricePerPerson * travelers;

    return {
        basePrice: priceWithAccommodation,
        travelers,
        discountPercent: tier.discountPercent,
        discountAmount: Math.round(discountAmount),
        pricePerPerson: Math.round(pricePerPerson),
        totalPrice: Math.round(totalPrice),
        tier: tier.label,
        tierDescription: tier.description,
        accommodationMultiplier: accommodation.multiplier
    };
}

/**
 * Format price as USD currency string
 */
export function formatPrice(price: number): string {
    return `$${price.toLocaleString('en-US')}`;
}

/**
 * Generate pricing summary text for display
 */
export function getPricingSummary(pricing: PricingResult): string {
    if (pricing.travelers === 1) {
        return `${formatPrice(pricing.pricePerPerson)} per person`;
    }
    return `${formatPrice(pricing.pricePerPerson)} per person × ${pricing.travelers} travelers = ${formatPrice(pricing.totalPrice)}`;
}

/**
 * Generate discount badge text
 */
export function getDiscountBadge(pricing: PricingResult): string | null {
    if (pricing.discountPercent === 0) return null;
    return `${pricing.discountPercent}% Group Discount`;
}

/**
 * Calculate savings compared to solo traveler price
 */
export function calculateSavings(basePrice: number, travelers: number, accommodationLevel: string = "mid-range"): number {
    const soloPricing = calculateSafariPrice(basePrice, 1, accommodationLevel);
    const groupPricing = calculateSafariPrice(basePrice, travelers, accommodationLevel);
    const soloTotal = soloPricing.pricePerPerson * travelers;
    return Math.round(soloTotal - groupPricing.totalPrice);
}
