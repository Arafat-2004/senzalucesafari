import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiResilience } from '@/lib/reliability/api-resilience';

interface TourResult {
    id: string;
    name: string;
    slug: string;
    category: string;
    shortDescription: string | null;
    overview: string | null;
    bestFor: string[];
    duration: string;
    startEnd: string;
    highlights: string[];
    itinerary: unknown;
    included: string[] | null;
    excluded: string[] | null;
    imageUrl: string | null;
    priceFrom: number;
    rating: number | null;
    reviewCount: number;
    destinations: (string | null)[];
    difficulty: string | null;
}

// GET /api/tours/ids?ids=ID1,ID2
export const GET = withApiResilience(async (req: Request) => {
    const url = new URL(req.url);
    const idsParam = url.searchParams.get('ids');
    if (!idsParam) return NextResponse.json({ success: true, data: [] }, { status: 200 });
    
    const ids = idsParam.split(',').map((s) => s.trim()).filter(Boolean);
    if (ids.length === 0) return NextResponse.json({ success: true, data: [] }, { status: 200 });

    // Fetch tours by IDs
    const tours = await prisma.tour.findMany({
      where: { id: { in: ids }, isActive: true },
      include: {
        destinations: { include: { destination: true } }
      }
    });

    // Map Prisma results to the client-facing TourPackage shape
    const result: TourResult[] = tours.map((t) => {
      return {
        id: t.id,
        name: t.name,
        slug: t.slug,
        category: t.category,
        shortDescription: t.shortDescription,
        overview: t.overview,
        bestFor: t.bestFor || [],
        duration: t.duration,
        startEnd: t.startEnd,
        highlights: t.highlights || [],
        itinerary: t.itinerary ?? [],
        included: t.included,
        excluded: t.excluded,
        imageUrl: t.imageUrl,
        priceFrom: t.priceFrom,
        rating: t.rating,
        reviewCount: t.reviewCount,
        destinations: (t.destinations ?? []).map((d) => d.destination?.slug).filter(Boolean),
        difficulty: t.difficulty,
      };
    });

    return NextResponse.json({ success: true, data: result });
}, { route: '/api/tours/ids', method: 'GET' });
