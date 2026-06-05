import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, canAccess } from '@/lib/admin-auth';
import { withApiResilience } from '@/lib/reliability/api-resilience';
import { logger } from '@/lib/reliability/logger';

/**
 * REVIEW_APPROVAL: Get single review details for admin
 * GET /api/reviews/[id]
 */
export const GET = withApiResilience(async (request: Request, ctx: Record<string, unknown>) => {
    const params = ctx.params as Promise<{ id: string }>
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canAccess(session, 50)) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    try {
        const { id } = await params;

        const review = await prisma.review.findUnique({
            where: { id },
            include: {
                tour: {
                    select: { id: true, name: true, slug: true },
                },
            },
        });

        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }

        return NextResponse.json({
            id: review.id,
            customerName: review.customerName,
            customerEmail: review.customerEmail,
            author: review.author,
            country: review.country,
            title: review.title,
            comment: review.comment,
            content: review.content,
            rating: review.rating,
            isApproved: review.isApproved,
            isFeatured: review.isFeatured,
            verified: review.verified,
            rejectionReason: review.rejectionReason,
            approvedAt: review.approvedAt,
            approvedBy: review.approvedBy,
            rejectedAt: review.rejectedAt,
            travelDate: review.travelDate,
            reviewDate: review.reviewDate,
            safariPackage: review.safariPackage,
            tour: review.tour,
            tourId: review.tourId,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
        });
    } catch (error) {
        logger.error('[Review Detail] Fetch error', { error: error instanceof Error ? error.message : String(error) });
        return NextResponse.json({ error: 'Failed to fetch review' }, { status: 500 });
    }
}, { route: '/api/reviews/:id', method: 'GET', requireAuth: true });
