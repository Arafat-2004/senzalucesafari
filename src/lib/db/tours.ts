import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import type { TourPackage, DayItinerary } from '@/types/tours';
import { tourPackages as staticTours } from '@/data/tours';

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
export const getAllTours = unstable_cache(
  async (): Promise<TourPackage[]> => {
    try {
      const tours = await prisma.tour.findMany({
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
          include: { destinations: { include: { destination: true } } },
      });
      return tours.map(mapTourToPackage);
    } catch {
      return staticTours;
    }
  },
  ['all-tours'],
  {
    revalidate: 3600, // 1 hour
    tags: ['tours'],
  }
);

/** Get a single tour by slug */
export const getTourBySlug = unstable_cache(
  async (slug: string): Promise<TourPackage | null> => {
    try {
      const tour = await prisma.tour.findUnique({
          where: { slug },
          include: { destinations: { include: { destination: true } } },
      });
      if (!tour) return null;
      return mapTourToPackage(tour);
    } catch {
      return staticTours.find(t => t.slug === slug) ?? null;
    }
  },
  ['tour-by-slug'],
  {
    revalidate: 7200, // 2 hours
    tags: ['tours', 'tour-detail'],
  }
);

/** Get tours by category */
export const getToursByCategory = unstable_cache(
  async (category: string): Promise<TourPackage[]> => {
    try {
      const tours = await prisma.tour.findMany({
          where: { category, isActive: true },
          orderBy: { displayOrder: 'asc' },
          include: { destinations: { include: { destination: true } } },
      });
      return tours.map(mapTourToPackage);
    } catch {
      return staticTours.filter(t => t.category === category);
    }
  },
  ['tours-by-category'],
  {
    revalidate: 3600, // 1 hour
    tags: ['tours'],
  }
);

/** Get tours that visit a specific destination */
export const getToursByDestination = unstable_cache(
  async (destinationSlug: string): Promise<TourPackage[]> => {
    try {
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
    } catch {
      return staticTours.filter(t => t.destinations?.includes(destinationSlug));
    }
  },
  ['tours-by-destination'],
  {
    revalidate: 3600, // 1 hour
    tags: ['tours'],
  }
);

/** Get featured tours */
export const getFeaturedTours = unstable_cache(
  async (limit = 3): Promise<TourPackage[]> => {
    try {
      const tours = await prisma.tour.findMany({
          where: { isActive: true, isFeatured: true },
          orderBy: { displayOrder: 'asc' },
          take: limit,
          include: { destinations: { include: { destination: true } } },
      });
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
    } catch {
      return staticTours.slice(0, limit);
    }
  },
  ['featured-tours'],
  {
    revalidate: 3600, // 1 hour
    tags: ['tours', 'featured'],
  }
);

/** Get all tour slugs (for generateStaticParams) */
export async function getAllTourSlugs(): Promise<string[]> {
    try {
      const tours = await prisma.tour.findMany({
          where: { isActive: true },
          select: { slug: true },
      });
      return tours.map((t: { slug: string }) => t.slug);
    } catch {
      return staticTours.map(t => t.slug);
    }
}
