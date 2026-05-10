import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import type { Destination, Activity, Wildlife, DestinationAccommodation, Itinerary, TravelTip, DestinationFAQ } from '@/types/destinations';
import { destinations as staticDestinations } from '@/data/destinations';

/**
 * Map a Prisma Destination row to the Destination application type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- DB record mapper
function mapDestination(d: Record<string, any>): Destination {
    const gt = (d.gettingThere ?? {}) as Record<string, string>;
    return {
        id: d.id as string,
        name: d.name as string,
        slug: d.slug as string,
        region: d.region as string,
        shortDescription: d.shortDescription as string,
        whyVisit: d.whyVisit as string,
        fullDescription: d.fullDescription as string,
        parkSize: (d.parkSize as string) ?? '',
        elevation: (d.elevation as string) ?? '',
        established: (d.established as string) ?? '',
        nearestAirport: (d.nearestAirport as string) ?? '',
        distanceFromArusha: (d.distanceFromArusha as string) ?? undefined,
        distanceFromDarEsSalaam: (d.distanceFromDarEsSalaam as string) ?? undefined,
        recommendedStay: (d.recommendedStay as string) ?? '',
        bigFive: (d.bigFive as string[]) ?? [],
        keySpecies: (d.keySpecies as string[]) ?? [],
        birdWatching: d.birdWatching as boolean,
        uniqueSpecies: (d.uniqueSpecies as string[]) ?? [],
        wildlifeRating: d.wildlifeRating as number,
        bestTimeToGo: (d.bestTimeToGo as string[]) ?? [],
        peakSeason: (d.peakSeason as string) ?? '',
        lowSeason: (d.lowSeason as string) ?? '',
        monthlyBreakdown: (d.monthlyBreakdown ?? []) as Destination['monthlyBreakdown'],
        activities: (d.activities ?? []) as Activity[],
        highlights: (d.highlights as string[]) ?? [],
        landscape: (d.landscape as string) ?? '',
        ecosystems: (d.ecosystems as string[]) ?? [],
        wildlife: (d.wildlife ?? []) as Wildlife[],
        accommodations: (d.accommodations ?? []) as DestinationAccommodation[],
        sampleItineraries: (d.sampleItineraries ?? []) as Itinerary[],
        suggestedItineraries: (d.suggestedItineraries as string) ?? undefined,
        gettingThere: {
            byAir: gt.byAir ?? '',
            byRoad: gt.byRoad ?? '',
            transferTime: gt.transferTime ?? '',
        },
        conservation: (d.conservation as string) ?? '',
        communityInitiatives: (d.communityInitiatives as string) ?? undefined,
        culturalContext: (d.culturalContext as string) ?? undefined,
        travelTips: (d.travelTips ?? []) as TravelTip[],
        faqs: (d.faqs ?? []) as DestinationFAQ[],
        imageUrl: d.imageUrl as string,
        gallery: (d.galleryImages as string[]) ?? (d.gallery as string[]) ?? [],
        localTribes: (d.localTribes as string[]) ?? [],
        relatedDestinations: (d.relatedDestinations as string[]) ?? [],
        metaTitle: (d.metaTitle as string) ?? undefined,
        metaDescription: (d.metaDescription as string) ?? undefined,
    };
}

/** Get all active destinations */
export const getAllDestinations = unstable_cache(
  async (): Promise<Destination[]> => {
    try {
      const destinations = await prisma.destination.findMany({
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
      });
      return destinations.map(mapDestination);
    } catch {
      return staticDestinations;
    }
  },
  ['all-destinations'],
  {
    revalidate: 3600, // 1 hour
    tags: ['destinations'],
  }
);

/** Get main circuit destinations (first 5) */
export const getMainDestinations = unstable_cache(
  async (): Promise<Destination[]> => {
    try {
      const destinations = await prisma.destination.findMany({
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
          take: 5,
      });
      return destinations.map(mapDestination);
    } catch {
      return staticDestinations.slice(0, 5);
    }
  },
  ['main-destinations'],
  {
    revalidate: 3600, // 1 hour
    tags: ['destinations'],
  }
);

/** Get a single destination by slug */
export const getDestinationBySlug = unstable_cache(
  async (slug: string): Promise<Destination | null> => {
    try {
      const d = await prisma.destination.findUnique({ where: { slug } });
      if (!d) return null;
      return mapDestination(d);
    } catch {
      return staticDestinations.find(d => d.slug === slug) ?? null;
    }
  },
  ['destination-by-slug'],
  {
    revalidate: 7200, // 2 hours
    tags: ['destinations', 'destination-detail'],
  }
);

/** Get destinations by region */
export async function getDestinationsByRegion(region: string): Promise<Destination[]> {
    try {
        const destinations = await prisma.destination.findMany({
            where: { region, isActive: true },
            orderBy: { displayOrder: 'asc' },
        });
        return destinations.map(mapDestination);
    } catch {
        return staticDestinations.filter(d => d.region === region);
    }
}

/** Get all destination slugs (for generateStaticParams) */
export async function getAllDestinationSlugs(): Promise<string[]> {
    try {
        const destinations = await prisma.destination.findMany({
            where: { isActive: true },
            select: { slug: true },
        });
        return destinations.map((d: { slug: string }) => d.slug);
    } catch {
        return staticDestinations.map(d => d.slug);
    }
}
