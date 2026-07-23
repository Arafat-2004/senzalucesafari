import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, canAccess } from '@/lib/admin-auth';
import { createNotification } from '@/lib/admin-audit';
import { withApiResilience } from '@/lib/reliability/api-resilience';
import { invalidateReviews, invalidateTours } from '@/lib/reliability/cache-manager';
import { logger } from '@/lib/reliability/logger';
import { sendReviewApprovedEmail } from '@/lib/email/review-approved';

/**
 * REVIEW_APPROVAL: Approve a review
 * POST /api/reviews/[id]/approve
 */
export const POST = withApiResilience(async (request: Request, ctx: Record<string, unknown>) => {
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

        // Get review with tour info
        const review = await prisma.review.findUnique({
            where: { id },
            include: { tour: { select: { name: true } } },
        });

        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }

        if (review.status === 'APPROVED') {
            return NextResponse.json({ error: 'Review is already approved' }, { status: 400 });
        }

        // Update review to approved
        const approvedReview = await prisma.review.update({
            where: { id },
            data: {
                isApproved: true,
                status: 'APPROVED',
                rejectionReason: null,
                rejectedAt: null,
                approvedAt: new Date(),
                approvedBy: session.id,
            },
        });

        // Create notification for admin
        createNotification({
            type: 'REVIEW_APPROVED',
            title: 'Review Approved',
            message: `"${review.title.substring(0, 50)}..." by ${review.customerName} is now live on ${review.tour.name}`,
            actionUrl: `/admin/reviews/${id}/edit`,
            targetRole: 'admin',
        }).catch(err => logger.error('[Review Approval] Notification error', { error: err instanceof Error ? err.message : String(err) }));

        // Notify customer that review is approved
        if (review.customerEmail) {
            sendReviewApprovedEmail({
                customerName: review.customerName,
                customerEmail: review.customerEmail,
                tourName: review.tour.name,
                rating: review.rating,
                title: review.title,
            }).catch(err => logger.error('[Review Approval] Email error', { error: err instanceof Error ? err.message : String(err) }));
        }

        // Invalidate caches since review is now public
        invalidateReviews();
        invalidateTours();

        return NextResponse.json(
            {
                success: true,
                message: 'Review approved and published',
                review: {
                    id: approvedReview.id,
                    status: approvedReview.status,
                    approvedAt: approvedReview.approvedAt,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        logger.error('[Review Approval] Error', { error: error instanceof Error ? error.message : String(error) });
        return NextResponse.json({ error: 'Failed to approve review' }, { status: 500 });
    }
}, { route: '/api/reviews/:id/approve', method: 'POST', requireAuth: true });
