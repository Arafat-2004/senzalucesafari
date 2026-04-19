import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/tours/ids?ids=ID1,ID2
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const idsParam = url.searchParams.get('ids');
    if (!idsParam) return NextResponse.json([], { status: 200 });
    const ids = idsParam.split(',').map((s) => s.trim()).filter(Boolean);
    if (ids.length === 0) return NextResponse.json([], { status: 200 });

    // Fetch tours by IDs
    const tours = await prisma.tour.findMany({
      where: { id: { in: ids }, isActive: true },
      include: {
        destinations: { include: { destination: true } }
      }
    });

    // Map Prisma results to the client-facing TourPackage shape
    const result = tours.map((t: any) => {
      return {
        id: t.id,
        name: t.name,
        slug: t.slug,
        category: t.category,
        shortDescription: t.shortDescription,
        overview: t.overview,
        bestFor: t.bestFor,
        duration: t.duration,
        startEnd: t.startEnd,
        highlights: t.highlights,
        itinerary: t.itinerary ?? [],
        included: t.included,
        excluded: t.excluded,
        imageUrl: t.imageUrl,
        priceFrom: t.priceFrom,
        rating: t.rating,
        reviewCount: t.reviewCount,
        destinations: (t.destinations ?? []).map((d: any) => d.destination?.slug).filter(Boolean),
        difficulty: t.difficulty,
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('Error fetching tours by IDs', err);
    return NextResponse.json([], { status: 500 });
  }
}
