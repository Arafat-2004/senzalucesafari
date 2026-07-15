import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { createNotification } from '@/lib/admin-audit';
import { checkRateLimit, getClientIp } from '@/lib/security';
import type { ReviewStatus } from '@/generated/prisma/client';
import { logger } from '@/lib/reliability/logger';
import { sendReviewAcknowledgmentEmail } from '@/lib/email/review-acknowledgment';

const reviewSchema = z.object({
    tourId: z.string().min(1, 'Tour ID is required').max(200),
    customerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
    customerEmail: z.string().email('Invalid email address').optional(),
    country: z.string().max(100).optional(),
    rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
    title: z.string().min(5, 'Title must be at least 5 characters').max(200),
    comment: z.string().min(10, 'Comment must be at least 10 characters').max(3000),
    travelDate: z.string().optional(),
    safariPackage: z.string().max(200).optional(),
});

export async function POST(request: Request) {
    try {
        const ip = getClientIp(request);
        const rateLimit = await checkRateLimit(ip, 'general');
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please wait before submitting another review.', retryAfter: rateLimit.retryAfter },
                { status: 429 }
            );
        }

        const body = await request.json();

        const validation = reviewSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.issues.map(e => ({ field: e.path.join('.'), message: e.message })) },
                { status: 400 }
            );
        }

        const data = validation.data;

        // Accept both UUID and slug for tour lookup
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.tourId);
        const tour = await prisma.tour.findUnique({
            where: isUuid ? { id: data.tourId } : { slug: data.tourId }
        });
        if (!tour) {
            return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
        }

        if (data.customerEmail) {
            const existingReview = await prisma.review.findFirst({
                where: { tourId: tour.id, customerEmail: data.customerEmail },
            });
            if (existingReview) {
                return NextResponse.json(
                    { error: 'You have already submitted a review for this tour' },
                    { status: 409 }
                );
            }
        }

        const reviewData = {
            tourId: tour.id,
            customerName: data.customerName,
            customerEmail: data.customerEmail || null,
            country: data.country || null,
            rating: data.rating,
            title: data.title,
            comment: data.comment,
            safariPackage: data.safariPackage || null,
            travelDate: data.travelDate ? new Date(data.travelDate) : null,
            reviewDate: new Date(),
            isApproved: false,
            status: 'PENDING' as ReviewStatus,
            verified: false,
        };

        const review = await prisma.review.create({ data: reviewData });

        createNotification({
            type: 'NEW_REVIEW',
            title: data.customerName,
            message: `${data.customerName} submitted a review (${data.rating}/5 stars) for "${tour.name}" — "${data.title}"`,
            actionUrl: `/admin/reviews/${review.id}/edit`,
        }).catch(err => logger.error('[Reviews] Notification error', { error: err instanceof Error ? err.message : String(err) }));

        if (data.customerEmail) {
            sendReviewAcknowledgmentEmail({
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                tourName: tour.name,
                rating: data.rating,
                title: data.title,
            }).catch(err => logger.error('[Reviews] Acknowledgment email error', { error: err instanceof Error ? err.message : String(err) }));
        }

        return NextResponse.json(
            { success: true, message: 'Review submitted successfully. It will be published after admin approval.', reviewId: review.id },
            { status: 201 }
        );
    } catch (error) {
        logger.error('[Reviews] Submission error', { error: error instanceof Error ? error.message : String(error) });
        return NextResponse.json(
            { error: 'Failed to submit review. Please try again.' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const tourId = searchParams.get('tourId');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const featured = searchParams.get('featured') === 'true';

        const where: { status: ReviewStatus; isFeatured?: boolean; tourId?: string } = { status: 'APPROVED' };
        if (tourId) where.tourId = tourId;
        if (featured) where.isFeatured = true;

        const [reviews, total, averageRating] = await Promise.all([
            prisma.review.findMany({
                where,
                orderBy: [
                    { isFeatured: 'desc' },
                    { createdAt: 'desc' },
                ],
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.review.count({ where }),
            prisma.review.aggregate({
                where,
                _avg: { rating: true },
            }),
        ]);

        return NextResponse.json({
            reviews,
            summary: {
                averageRating: averageRating._avg.rating || 0,
                totalReviews: total,
            },
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        logger.error('[Reviews] Fetch error', { error: error instanceof Error ? error.message : String(error) });
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}
