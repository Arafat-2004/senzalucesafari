import { prisma } from '@/lib/prisma';
import type { Review } from '@/types/reviews';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- DB record mapper
function mapReview(r: Record<string, any>): Review {
    return {
        id: r.id,
        author: r.author ?? r.customerName,
        rating: r.rating,
        title: r.title,
        content: r.content ?? r.comment,
        date: r.reviewDate
            ? new Date(r.reviewDate).toISOString().split('T')[0]
            : new Date(r.createdAt).toISOString().split('T')[0],
        safariPackage: r.safariPackage ?? undefined,
        helpful: r.helpfulCount,
        verified: r.verified,
    };
}

/** Get all approved reviews */
export async function getApprovedReviews(): Promise<Review[]> {
    const reviews = await prisma.review.findMany({
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
    });
    return reviews.map(mapReview);
}

/** Get featured reviews */
export async function getFeaturedReviews(): Promise<Review[]> {
    const reviews = await prisma.review.findMany({
        where: { isApproved: true, isFeatured: true },
        orderBy: { createdAt: 'desc' },
    });
    return reviews.map(mapReview);
}

/** Get reviews by tour */
export async function getReviewsByTour(tourId: string): Promise<Review[]> {
    const reviews = await prisma.review.findMany({
        where: { tourId, isApproved: true },
        orderBy: { createdAt: 'desc' },
    });
    return reviews.map(mapReview);
}
