import type { Tour, TourPricing } from '../generated/prisma/client'

export interface PriceCalculation {
    pricePerPerson: number
    totalPrice: number
    numberOfPeople: number
    pricingModel: 'base' | 'tiered'
    tierUsed?: string
}

export function calculateTourPrice(
    tour: Pick<Tour, 'priceFrom' | 'id'>,
    tourPricing: Pick<TourPricing, 'pricePerPerson2' | 'pricePerPerson3' | 'pricePerPerson4' | 'pricePerPerson5' | 'pricePerPerson6'> | null,
    numberOfPeople: number
): PriceCalculation {
    const people = Math.max(1, Math.min(numberOfPeople || 1, 20))
    
    if (!tourPricing || people === 1) {
        return {
            pricePerPerson: tour.priceFrom || 0,
            totalPrice: (tour.priceFrom || 0) * people,
            numberOfPeople: people,
            pricingModel: 'base',
        }
    }

    let pricePerPerson: number
    let tierUsed: string

    if (people >= 6 && tourPricing.pricePerPerson6) {
        pricePerPerson = tourPricing.pricePerPerson6
        tierUsed = '6+ people'
    } else if (people >= 5 && tourPricing.pricePerPerson5) {
        pricePerPerson = tourPricing.pricePerPerson5
        tierUsed = '5 people'
    } else if (people >= 4 && tourPricing.pricePerPerson4) {
        pricePerPerson = tourPricing.pricePerPerson4
        tierUsed = '4 people'
    } else if (people >= 3 && tourPricing.pricePerPerson3) {
        pricePerPerson = tourPricing.pricePerPerson3
        tierUsed = '3 people'
    } else if (people >= 2 && tourPricing.pricePerPerson2) {
        pricePerPerson = tourPricing.pricePerPerson2
        tierUsed = '2 people'
    } else {
        return {
            pricePerPerson: tour.priceFrom || 0,
            totalPrice: (tour.priceFrom || 0) * people,
            numberOfPeople: people,
            pricingModel: 'base',
        }
    }

    return {
        pricePerPerson,
        totalPrice: pricePerPerson * people,
        numberOfPeople: people,
        pricingModel: 'tiered',
        tierUsed,
    }
}

export function formatPrice(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount)
}