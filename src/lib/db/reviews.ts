import { prisma } from '@/lib/prisma';
import type { Review } from '@/types/reviews';
import { testimonials as staticTestimonials } from '@/data/company';
import { isProductionBuildPhase } from '@/lib/build-mode';

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
    if (isProductionBuildPhase()) return [];
    try {
      const reviews = await prisma.review.findMany({
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
      });
      return reviews.map(mapReview);
    } catch {
      return [];
    }
}

/** Get featured reviews */
export async function getFeaturedReviews(): Promise<Review[]> {
    if (isProductionBuildPhase()) return [];
    try {
      const reviews = await prisma.review.findMany({
          where: { status: 'APPROVED', isFeatured: true },
          orderBy: { createdAt: 'desc' },
      });
      return reviews.map(mapReview);
    } catch {
      return [];
    }
}

/** Get reviews by tour */
export async function getReviewsByTour(tourId: string): Promise<Review[]> {
    if (isProductionBuildPhase()) return [];
    try {
      const reviews = await prisma.review.findMany({
          where: { tourId, status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
      });
      return reviews.map(mapReview);
    } catch {
      return [];
    }
}

export interface TestimonialData {
    id: string;
    name: string;
    location: string;
    text: string;
    rating: number;
    tour?: string;
}

/** Get featured testimonials for homepage */
export async function getFeaturedTestimonials(): Promise<TestimonialData[]> {
    if (isProductionBuildPhase()) return staticTestimonials;
    try {
      const reviews = await prisma.review.findMany({
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { tour: { select: { name: true } } },
      });

      return reviews.map(r => ({
          id: r.id,
          name: r.customerName,
          location: r.country || 'Tanzania',
          text: r.comment,
          rating: r.rating,
          tour: r.tour?.name ?? r.safariPackage ?? undefined,
      }));
    } catch {
      return staticTestimonials;
    }
}
