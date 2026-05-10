import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * REVIEW_APPROVAL: Public site fetches APPROVED reviews for a tour
 * GET /api/reviews/tour/[tourId]
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ tourId: string }> }
) {
    try {
        const { tourId } = await params;

        // REVIEW_APPROVAL: Only fetch APPROVED reviews for public display
        const reviews = await prisma.review.findMany({
            where: {
                tourId,
                status: 'APPROVED',
            },
            select: {
                id: true,
                customerName: true,
                title: true,
                comment: true,
                rating: true,
                createdAt: true,
                isFeatured: true,
                country: true,
                safariPackage: true,
            },
            orderBy: [
                { isFeatured: 'desc' },
                { createdAt: 'desc' },
            ],
            take: 50,
        });

        // Calculate average rating from approved reviews
        const avgResult = await prisma.review.aggregate({
            where: {
                tourId,
                status: 'APPROVED',
            },
            _avg: { rating: true },
            _count: { id: true },
        });

        return NextResponse.json({
            reviews,
            stats: {
                totalReviews: avgResult._count.id,
                averageRating: avgResult._avg.rating ? parseFloat(avgResult._avg.rating.toFixed(1)) : 0,
            },
        });
    } catch (error) {
        console.error('[Reviews Tour] Fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}
