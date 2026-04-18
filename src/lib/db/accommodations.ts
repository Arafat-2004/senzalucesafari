import { prisma } from '@/lib/prisma';
import type { AccommodationOption } from '@/types/accommodations';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- DB record mapper
function mapAccommodation(a: Record<string, any>): AccommodationOption {
    const images = a.images as string[] | undefined;
    const highlights = a.highlights as string[] | undefined;
    return {
        id: a.id as string,
        name: a.name as string,
        tier: ((a.tier ?? (a.type as string)?.toLowerCase().replace('-', '') ?? 'midrange') as AccommodationOption['tier']),
        location: a.location as string,
        description: a.description as string,
        priceRange: (a.priceRange ?? '') as string,
        pricePerNight: (a.pricePerNight ?? '') as string,
        rating: a.rating as number,
        image: images?.[0] ?? '',
        features: highlights ?? [],
        amenities: (a.amenities ?? []) as string[],
        bestFor: (a.bestFor ?? []) as string[],
        highlights: (a.highlights ?? []) as string[],
    };
}

/** Get all active accommodations */
export async function getAllAccommodations(): Promise<AccommodationOption[]> {
    const accommodations = await prisma.accommodation.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
    });
    return accommodations.map(mapAccommodation);
}

/** Get accommodations by tier */
export async function getAccommodationsByTier(tier: 'luxury' | 'midrange' | 'budget'): Promise<AccommodationOption[]> {
    // Map tier to the DB type field
    const typeMap: Record<string, string> = {
        luxury: 'Luxury',
        midrange: 'Mid-Range',
        budget: 'Budget',
    };
    const accommodations = await prisma.accommodation.findMany({
        where: { isActive: true, type: typeMap[tier] ?? tier },
        orderBy: { name: 'asc' },
    });
    return accommodations.map(mapAccommodation);
}
