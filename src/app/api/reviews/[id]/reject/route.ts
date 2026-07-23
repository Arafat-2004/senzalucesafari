import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, canAccess } from '@/lib/admin-auth';
import { createNotification } from '@/lib/admin-audit';
import { withApiResilience } from '@/lib/reliability/api-resilience';
import { logger } from '@/lib/reliability/logger';
import { sendReviewRejectedEmail } from '@/lib/email/review-rejected';
import { invalidateReviews, invalidateTours } from '@/lib/reliability/cache-manager';

/**
 * REVIEW_APPROVAL: Reject a review (soft delete — keep in DB)
 * POST /api/reviews/[id]/reject
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
        const body = await request.json();
        const reason = body.reason || 'No reason provided';

        // Get review
        const review = await prisma.review.findUnique({
            where: { id },
            include: { tour: { select: { name: true } } },
        });

        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }

        if (review.status === 'REJECTED') {
            return NextResponse.json({ error: 'Review is already rejected' }, { status: 400 });
        }

        // Update review to rejected (soft delete — keep in DB)
        const rejectedReview = await prisma.review.update({
            where: { id },
            data: {
                isApproved: false,
                isFeatured: false,
                status: 'REJECTED',
                approvedAt: null,
                approvedBy: null,
                rejectionReason: reason,
                rejectedAt: new Date(),
            },
        });

        // Create notification for admin
        createNotification({
            type: 'REVIEW_REJECTED',
            title: 'Review Rejected',
            message: `Review "${review.title.substring(0, 50)}..." by ${review.customerName} was rejected: ${reason.substring(0, 100)}`,
            actionUrl: `/admin/reviews/${id}/edit`,
            targetRole: 'admin',
        }).catch(err => logger.error('[Review Rejection] Notification error', { error: err instanceof Error ? err.message : String(err) }));

        // Notify customer that review was rejected
        if (review.customerEmail) {
            sendReviewRejectedEmail({
                customerName: review.customerName,
                customerEmail: review.customerEmail,
                tourName: review.tour.name,
                title: review.title,
                reason,
            }).catch(err => logger.error('[Review Rejection] Email error', { error: err instanceof Error ? err.message : String(err) }));
        }

        invalidateReviews();
        invalidateTours();

        return NextResponse.json(
            {
                success: true,
                message: 'Review rejected and hidden',
                review: {
                    id: rejectedReview.id,
                    isApproved: rejectedReview.isApproved,
                    rejectionReason: rejectedReview.rejectionReason,
                    rejectedAt: rejectedReview.rejectedAt,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        logger.error('[Review Rejection] Error', { error: error instanceof Error ? error.message : String(error) });
        return NextResponse.json({ error: 'Failed to reject review' }, { status: 500 });
    }
}, { route: '/api/reviews/:id/reject', method: 'POST', requireAuth: true });
