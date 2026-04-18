import { prisma } from '@/lib/prisma';
import type { TourPackage, DayItinerary } from '@/types/tours';

/**
 * Map a Prisma Tour row to the TourPackage application type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- DB record mapper
function mapTourToPackage(tour: Record<string, any>): TourPackage {
    const destinations = tour.destinations as Array<{ destination?: { slug?: string } }> | undefined;
    return {
        id: tour.id as string,
        name: tour.name as string,
        slug: tour.slug as string,
        category: tour.category as string,
        shortDescription: tour.shortDescription as string,
        overview: tour.overview as string,
        bestFor: tour.bestFor as string[],
        duration: tour.duration as string,
        startEnd: tour.startEnd as string,
        highlights: tour.highlights as string[],
        itinerary: (tour.itinerary ?? []) as DayItinerary[],
        included: tour.included as string[],
        excluded: tour.excluded as string[],
        imageUrl: tour.imageUrl as string,
        priceFrom: tour.priceFrom as number,
        rating: tour.rating as number,
        reviewCount: tour.reviewCount as number,
        difficulty: (tour.difficulty ?? undefined) as string | undefined,
        destinations: destinations?.map((td) => td.destination?.slug).filter(Boolean) as string[] | undefined,
    };
}

/** Get all active tours */
export async function getAllTours(): Promise<TourPackage[]> {
    const tours = await prisma.tour.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
        include: { destinations: { include: { destination: true } } },
    });
    return tours.map(mapTourToPackage);
}

/** Get a single tour by slug */
export async function getTourBySlug(slug: string): Promise<TourPackage | null> {
    const tour = await prisma.tour.findUnique({
        where: { slug },
        include: { destinations: { include: { destination: true } } },
    });
    if (!tour) return null;
    return mapTourToPackage(tour);
}

/** Get tours by category */
export async function getToursByCategory(category: string): Promise<TourPackage[]> {
    const tours = await prisma.tour.findMany({
        where: { category, isActive: true },
        orderBy: { displayOrder: 'asc' },
        include: { destinations: { include: { destination: true } } },
    });
    return tours.map(mapTourToPackage);
}

/** Get tours that visit a specific destination */
export async function getToursByDestination(destinationSlug: string): Promise<TourPackage[]> {
    const tours = await prisma.tour.findMany({
        where: {
            isActive: true,
            destinations: {
                some: { destination: { slug: destinationSlug } },
            },
        },
        orderBy: { displayOrder: 'asc' },
        include: { destinations: { include: { destination: true } } },
    });
    return tours.map(mapTourToPackage);
}

/** Get featured tours */
export async function getFeaturedTours(limit = 3): Promise<TourPackage[]> {
    const tours = await prisma.tour.findMany({
        where: { isActive: true, isFeatured: true },
        orderBy: { displayOrder: 'asc' },
        take: limit,
        include: { destinations: { include: { destination: true } } },
    });
    // Fallback to first N tours if none are featured
    if (tours.length === 0) {
        const fallback = await prisma.tour.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
            take: limit,
            include: { destinations: { include: { destination: true } } },
        });
        return fallback.map(mapTourToPackage);
    }
    return tours.map(mapTourToPackage);
}

/** Get all tour slugs (for generateStaticParams) */
export async function getAllTourSlugs(): Promise<string[]> {
    const tours = await prisma.tour.findMany({
        where: { isActive: true },
        select: { slug: true },
    });
    return tours.map((t: { slug: string }) => t.slug);
}
