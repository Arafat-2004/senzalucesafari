import { describe, it, expect } from '@jest/globals';
import {
    calculateSafariPrice,
    getPricingTier,
    getAccommodationLevel,
    formatPrice,
    getPricingSummary,
    getDiscountBadge,
    calculateSavings,
    PRICING_TIERS,
    ACCOMMODATION_LEVELS
} from '@/lib/pricing-engine';
import type { PricingResult } from '@/lib/pricing-engine';

describe('Pricing Engine - Pricing Tiers', () => {
    describe('getPricingTier', () => {
        it('should return Solo Traveler tier for 1 traveler', () => {
            const tier = getPricingTier(1);
            expect(tier.label).toBe('Solo Traveler');
            expect(tier.discountPercent).toBe(0);
            expect(tier.minTravelers).toBe(1);
            expect(tier.maxTravelers).toBe(1);
        });

        it('should return Couple tier for 2 travelers', () => {
            const tier = getPricingTier(2);
            expect(tier.label).toBe('Couple');
            expect(tier.discountPercent).toBe(5);
        });

        it('should return Small Group tier for 3-4 travelers', () => {
            expect(getPricingTier(3).label).toBe('Small Group');
            expect(getPricingTier(3).discountPercent).toBe(10);
            expect(getPricingTier(4).label).toBe('Small Group');
            expect(getPricingTier(4).discountPercent).toBe(10);
        });

        it('should return Group tier for 5-6 travelers', () => {
            expect(getPricingTier(5).label).toBe('Group');
            expect(getPricingTier(5).discountPercent).toBe(15);
            expect(getPricingTier(6).label).toBe('Group');
            expect(getPricingTier(6).discountPercent).toBe(15);
        });

        it('should return Large Group tier for 7-10 travelers', () => {
            expect(getPricingTier(7).label).toBe('Large Group');
            expect(getPricingTier(7).discountPercent).toBe(20);
            expect(getPricingTier(10).label).toBe('Large Group');
            expect(getPricingTier(10).discountPercent).toBe(20);
        });

        it('should return Premium Group tier for 11+ travelers', () => {
            expect(getPricingTier(11).label).toBe('Premium Group');
            expect(getPricingTier(11).discountPercent).toBe(25);
            expect(getPricingTier(20).label).toBe('Premium Group');
            expect(getPricingTier(99).label).toBe('Premium Group');
        });

        it('should handle edge case of 0 travelers (fallback to last tier)', () => {
            const tier = getPricingTier(0);
            expect(tier).toBe(PRICING_TIERS[PRICING_TIERS.length - 1]);
        });

        it('should handle negative travelers (fallback to last tier)', () => {
            const tier = getPricingTier(-5);
            expect(tier).toBe(PRICING_TIERS[PRICING_TIERS.length - 1]);
        });
    });
});

describe('Pricing Engine - Accommodation Levels', () => {
    describe('getAccommodationLevel', () => {
        it('should return Budget level', () => {
            const level = getAccommodationLevel('budget');
            expect(level.id).toBe('budget');
            expect(level.label).toBe('Budget');
            expect(level.multiplier).toBe(0.85);
        });

        it('should return Mid-Range level', () => {
            const level = getAccommodationLevel('mid-range');
            expect(level.id).toBe('mid-range');
            expect(level.label).toBe('Mid-Range');
            expect(level.multiplier).toBe(1.0);
        });

        it('should return Luxury level', () => {
            const level = getAccommodationLevel('luxury');
            expect(level.id).toBe('luxury');
            expect(level.label).toBe('Luxury');
            expect(level.multiplier).toBe(1.40);
        });

        it('should return Premium level', () => {
            const level = getAccommodationLevel('premium');
            expect(level.id).toBe('premium');
            expect(level.label).toBe('Premium');
            expect(level.multiplier).toBe(1.80);
        });

        it('should return Mid-Range as default for invalid ID', () => {
            const level = getAccommodationLevel('invalid');
            expect(level.id).toBe('mid-range');
            expect(level.multiplier).toBe(1.0);
        });

        it('should return Mid-Range as default for empty string', () => {
            const level = getAccommodationLevel('');
            expect(level.id).toBe('mid-range');
        });
    });
});

describe('Pricing Engine - Price Calculations', () => {
    describe('calculateSafariPrice', () => {
        it('should calculate correct price for solo traveler with mid-range', () => {
            const result = calculateSafariPrice(3000, 1, 'mid-range');

            expect(result.basePrice).toBe(3000);
            expect(result.travelers).toBe(1);
            expect(result.discountPercent).toBe(0);
            expect(result.discountAmount).toBe(0);
            expect(result.pricePerPerson).toBe(3000);
            expect(result.totalPrice).toBe(3000);
            expect(result.tier).toBe('Solo Traveler');
            expect(result.accommodationMultiplier).toBe(1.0);
        });

        it('should calculate correct price for couple with 5% discount', () => {
            const result = calculateSafariPrice(3000, 2, 'mid-range');

            expect(result.discountPercent).toBe(5);
            expect(result.discountAmount).toBe(150); // 3000 * 0.05
            expect(result.pricePerPerson).toBe(2850); // 3000 - 150
            expect(result.totalPrice).toBe(5700); // 2850 * 2
            expect(result.tier).toBe('Couple');
        });

        it('should calculate correct price for small group (3-4) with 10% discount', () => {
            const result = calculateSafariPrice(3000, 4, 'mid-range');

            expect(result.discountPercent).toBe(10);
            expect(result.discountAmount).toBe(300); // 3000 * 0.10
            expect(result.pricePerPerson).toBe(2700); // 3000 - 300
            expect(result.totalPrice).toBe(10800); // 2700 * 4
            expect(result.tier).toBe('Small Group');
        });

        it('should apply Budget accommodation multiplier (-15%)', () => {
            const result = calculateSafariPrice(3000, 1, 'budget');

            expect(result.basePrice).toBe(2550); // 3000 * 0.85
            expect(result.pricePerPerson).toBe(2550);
            expect(result.accommodationMultiplier).toBe(0.85);
        });

        it('should apply Luxury accommodation multiplier (+40%)', () => {
            const result = calculateSafariPrice(3000, 1, 'luxury');

            expect(result.basePrice).toBe(4200); // 3000 * 1.40
            expect(result.pricePerPerson).toBe(4200);
            expect(result.accommodationMultiplier).toBe(1.40);
        });

        it('should apply Premium accommodation multiplier (+80%)', () => {
            const result = calculateSafariPrice(3000, 1, 'premium');

            expect(result.basePrice).toBe(5400); // 3000 * 1.80
            expect(result.pricePerPerson).toBe(5400);
            expect(result.accommodationMultiplier).toBe(1.80);
        });

        it('should combine group discount with luxury accommodation', () => {
            const result = calculateSafariPrice(3000, 6, 'luxury');

            // 3000 * 1.40 = 4200 (luxury)
            // 4200 * 0.15 = 630 (15% discount)
            // 4200 - 630 = 3570 (per person)
            // 3570 * 6 = 21420 (total)
            expect(result.basePrice).toBe(4200);
            expect(result.discountPercent).toBe(15);
            expect(result.discountAmount).toBe(630);
            expect(result.pricePerPerson).toBe(3570);
            expect(result.totalPrice).toBe(21420);
        });

        it('should handle minimum traveler count (1)', () => {
            const result = calculateSafariPrice(3000, 0, 'mid-range');
            expect(result.travelers).toBe(1);
            expect(result.pricePerPerson).toBe(3000);
        });

        it('should handle maximum traveler count (20)', () => {
            const result = calculateSafariPrice(3000, 25, 'mid-range');
            expect(result.travelers).toBe(20);
            expect(result.discountPercent).toBe(25); // Premium Group
        });

        it('should handle negative base price (clamp to 0)', () => {
            const result = calculateSafariPrice(-100, 1, 'mid-range');
            expect(result.basePrice).toBe(0);
            expect(result.pricePerPerson).toBe(0);
            expect(result.totalPrice).toBe(0);
        });

        it('should round prices to whole numbers', () => {
            const result = calculateSafariPrice(3001, 3, 'mid-range');

            expect(result.pricePerPerson).toBe(2701); // 3001 * 0.9 = 2700.9 -> 2701
            expect(result.totalPrice).toBe(8103); // 2701 * 3 (not 4 travelers)
            expect(result.discountAmount).toBe(300); // 3001 * 0.1 = 300.1 -> 300
        });

        it('should use mid-range as default accommodation level', () => {
            const resultWithDefault = calculateSafariPrice(3000, 1);
            const resultExplicit = calculateSafariPrice(3000, 1, 'mid-range');

            expect(resultWithDefault).toEqual(resultExplicit);
        });
    });
});

describe('Pricing Engine - Utility Functions', () => {
    describe('formatPrice', () => {
        it('should format small prices correctly', () => {
            expect(formatPrice(100)).toBe('$100');
            expect(formatPrice(999)).toBe('$999');
        });

        it('should format large prices with commas', () => {
            expect(formatPrice(1000)).toBe('$1,000');
            expect(formatPrice(10000)).toBe('$10,000');
            expect(formatPrice(1234567)).toBe('$1,234,567');
        });

        it('should handle zero', () => {
            expect(formatPrice(0)).toBe('$0');
        });

        it('should handle decimal values', () => {
            expect(formatPrice(1234.56)).toBe('$1,234.56');
        });
    });

    describe('getPricingSummary', () => {
        it('should return simple format for solo traveler', () => {
            const pricing: PricingResult = {
                basePrice: 3000,
                travelers: 1,
                discountPercent: 0,
                discountAmount: 0,
                pricePerPerson: 3000,
                totalPrice: 3000,
                tier: 'Solo Traveler',
                tierDescription: 'Base price for individual travelers',
                accommodationMultiplier: 1.0
            };

            expect(getPricingSummary(pricing)).toBe('$3,000 per person');
        });

        it('should return detailed format for group', () => {
            const pricing: PricingResult = {
                basePrice: 3000,
                travelers: 4,
                discountPercent: 10,
                discountAmount: 300,
                pricePerPerson: 2700,
                totalPrice: 10800,
                tier: 'Small Group',
                tierDescription: '10% discount for 3-4 travelers',
                accommodationMultiplier: 1.0
            };

            expect(getPricingSummary(pricing)).toBe(
                '$2,700 per person × 4 travelers = $10,800'
            );
        });
    });

    describe('getDiscountBadge', () => {
        it('should return null for no discount', () => {
            const pricing: PricingResult = {
                basePrice: 3000,
                travelers: 1,
                discountPercent: 0,
                discountAmount: 0,
                pricePerPerson: 3000,
                totalPrice: 3000,
                tier: 'Solo Traveler',
                tierDescription: 'Base price for individual travelers',
                accommodationMultiplier: 1.0
            };

            expect(getDiscountBadge(pricing)).toBeNull();
        });

        it('should return badge text for discounts', () => {
            const pricing: PricingResult = {
                basePrice: 3000,
                travelers: 2,
                discountPercent: 5,
                discountAmount: 150,
                pricePerPerson: 2850,
                totalPrice: 5700,
                tier: 'Couple',
                tierDescription: '5% discount for 2 travelers',
                accommodationMultiplier: 1.0
            };

            expect(getDiscountBadge(pricing)).toBe('5% Group Discount');
        });

        it('should handle larger discounts', () => {
            const pricing: PricingResult = {
                basePrice: 3000,
                travelers: 10,
                discountPercent: 20,
                discountAmount: 600,
                pricePerPerson: 2400,
                totalPrice: 24000,
                tier: 'Large Group',
                tierDescription: '20% discount for 7-10 travelers',
                accommodationMultiplier: 1.0
            };

            expect(getDiscountBadge(pricing)).toBe('20% Group Discount');
        });
    });

    describe('calculateSavings', () => {
        it('should calculate savings for group vs solo', () => {
            const savings = calculateSavings(3000, 4, 'mid-range');

            // Solo total: 3000 * 4 = 12000
            // Group total: 2700 * 4 = 10800
            // Savings: 12000 - 10800 = 1200
            expect(savings).toBe(1200);
        });

        it('should return 0 savings for solo traveler', () => {
            const savings = calculateSavings(3000, 1, 'mid-range');
            expect(savings).toBe(0);
        });

        it('should calculate savings with luxury accommodation', () => {
            const savings = calculateSavings(3000, 2, 'luxury');

            // Solo with luxury: 4200 * 2 = 8400
            // Couple with luxury: 3990 * 2 = 7980
            // Savings: 8400 - 7980 = 420
            expect(savings).toBe(420);
        });

        it('should calculate savings for large group', () => {
            const savings = calculateSavings(3000, 10, 'mid-range');

            // Solo total: 3000 * 10 = 30000
            // Large group: 2400 * 10 = 24000
            // Savings: 6000
            expect(savings).toBe(6000);
        });
    });
});

describe('Pricing Engine - Integration Tests', () => {
    it('should calculate realistic safari package pricing', () => {
        // Test a 5-day Serengeti safari for a family of 4 with luxury accommodation
        const result = calculateSafariPrice(4500, 4, 'luxury');

        expect(result.basePrice).toBe(6300); // 4500 * 1.40
        expect(result.discountPercent).toBe(10); // Small group
        expect(result.discountAmount).toBe(630); // 6300 * 0.10
        expect(result.pricePerPerson).toBe(5670);
        expect(result.totalPrice).toBe(22680);
        expect(result.tier).toBe('Small Group');
    });

    it('should handle budget-conscious solo traveler', () => {
        const result = calculateSafariPrice(2500, 1, 'budget');

        expect(result.basePrice).toBe(2125); // 2500 * 0.85
        expect(result.pricePerPerson).toBe(2125);
        expect(result.totalPrice).toBe(2125);
        expect(result.tier).toBe('Solo Traveler');
    });

    it('should handle large group with premium accommodation', () => {
        const result = calculateSafariPrice(5000, 8, 'premium');

        expect(result.basePrice).toBe(9000); // 5000 * 1.80
        expect(result.discountPercent).toBe(20); // Large group
        expect(result.discountAmount).toBe(1800);
        expect(result.pricePerPerson).toBe(7200);
        expect(result.totalPrice).toBe(57600);
    });

    it('should provide accurate savings information for marketing', () => {
        const basePrice = 3500;
        const travelers = 6;

        const pricing = calculateSafariPrice(basePrice, travelers, 'mid-range');
        const savings = calculateSavings(basePrice, travelers, 'mid-range');

        // Verify savings calculation
        const soloTotal = calculateSafariPrice(basePrice, 1, 'mid-range').pricePerPerson * travelers;
        const groupTotal = pricing.totalPrice;

        expect(savings).toBe(soloTotal - groupTotal);
        expect(savings).toBeGreaterThan(0);
    });
});

describe('Pricing Engine - Data Consistency', () => {
    it('should have all pricing tiers with valid ranges', () => {
        PRICING_TIERS.forEach((tier, index) => {
            expect(tier.minTravelers).toBeGreaterThan(0);
            expect(tier.maxTravelers).toBeGreaterThanOrEqual(tier.minTravelers);
            expect(tier.discountPercent).toBeGreaterThanOrEqual(0);
            expect(tier.discountPercent).toBeLessThanOrEqual(100);
            expect(tier.label).toBeDefined();
            expect(tier.description).toBeDefined();

            // Check continuity (except first tier)
            if (index > 0) {
                expect(tier.minTravelers).toBe(PRICING_TIERS[index - 1].maxTravelers + 1);
            }
        });
    });

    it('should have all accommodation levels with valid multipliers', () => {
        ACCOMMODATION_LEVELS.forEach(level => {
            expect(level.id).toBeDefined();
            expect(level.label).toBeDefined();
            expect(level.multiplier).toBeGreaterThan(0);
            expect(level.multiplier).toBeLessThanOrEqual(3.0); // Reasonable max
            expect(level.description).toBeDefined();
        });
    });

    it('should have at least one default accommodation level', () => {
        const midRange = ACCOMMODATION_LEVELS.find(l => l.id === 'mid-range');
        expect(midRange).toBeDefined();
        expect(midRange?.multiplier).toBe(1.0);
    });
});
