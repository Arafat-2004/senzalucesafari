import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/security';
import { getSession, canAccess } from '@/lib/admin-auth';
import { z } from 'zod';
import { withApiResilience } from '@/lib/reliability/api-resilience';

/**
 * Reviews API Route
 * 
 * POST /api/reviews - Submit a new review
 * GET /api/reviews - Get approved reviews
 */

// Validation schema for review submission
const reviewSchema = z.object({
    tourId: z.string().uuid('Invalid tour ID'),
    customerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
    customerEmail: z.string().email('Invalid email address').optional(),
    country: z.string().max(100).optional(),
    rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
    title: z.string().min(5, 'Title must be at least 5 characters').max(200),
    comment: z.string().min(10, 'Comment must be at least 10 characters').max(3000),
    travelDate: z.string().optional(),
    safariPackage: z.string().max(200).optional(),
});

export const POST = withApiResilience(async (request: Request) => {
    try {
        // Rate limiting
        const ip = getClientIp(request);

        const rateLimit = await checkRateLimit(ip, 'general');
        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Too many review submissions. Please wait before submitting another review.',
                    retryAfter: rateLimit.retryAfter,
                },
                { status: 429 }
            );
        }

        // Parse and validate request body
        const body = await request.json();
        const validation = reviewSchema.safeParse(body);

        if (!validation.success) {
            const errors = validation.error.issues.map((err) => ({
                field: String(err.path.join('.')),
                message: err.message,
            }));

            return NextResponse.json(
                { error: 'Validation failed', details: errors },
                { status: 400 }
            );
        }

        const data = validation.data;

        // Verify tour exists
        const tour = await prisma.tour.findUnique({
            where: { id: data.tourId },
        });

        if (!tour) {
            return NextResponse.json(
                { error: 'Tour not found' },
                { status: 404 }
            );
        }

        // Check for duplicate review (same email + tour)
        if (data.customerEmail) {
            const existingReview = await prisma.review.findFirst({
                where: {
                    tourId: data.tourId,
                    customerEmail: data.customerEmail,
                },
            });

            if (existingReview) {
                return NextResponse.json(
                    { error: 'You have already submitted a review for this tour' },
                    { status: 409 }
                );
            }
        }

        // Create review (requires admin approval)
        const review = await prisma.review.create({
            data: {
                tourId: data.tourId,
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                country: data.country,
                rating: data.rating,
                title: data.title,
                comment: data.comment,
                safariPackage: data.safariPackage,
                travelDate: data.travelDate ? new Date(data.travelDate) : null,
                reviewDate: new Date(),
                isApproved: false, // Requires admin approval
                verified: false,
            },
        });

        // TODO: Send notification to admin for review approval

        return NextResponse.json(
            {
                success: true,
                message: 'Review submitted successfully. It will be published after admin approval.',
                reviewId: review.id,
            },
            { status: 201 }
        );
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('[Reviews] Submission error:', error);
        }

        return NextResponse.json(
            { error: 'Failed to submit review. Please try again.' },
            { status: 500 }
        );
    }
}, { route: '/api/reviews', method: 'POST' });

export const GET = withApiResilience(async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const tourId = searchParams.get('tourId');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const featured = searchParams.get('featured') === 'true';
        const adminView = searchParams.get('admin') === 'true';

        let where: { isApproved?: boolean; isFeatured?: boolean; tourId?: string };

        if (adminView) {
            const session = await getSession();
            if (!session) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            if (!canAccess(session, 50)) {
                return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
            }
            where = {};
            if (tourId) where.tourId = tourId;
            if (featured) where.isFeatured = true;
        } else {
            where = { isApproved: true };
            if (tourId) where.tourId = tourId;
            if (featured) where.isFeatured = true;
        }

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
                _avg: {
                    rating: true,
                },
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
        if (process.env.NODE_ENV === 'development') {
            console.error('[Reviews] Fetch error:', error);
        }

        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}, { route: '/api/reviews', method: 'GET' });
