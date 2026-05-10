import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, canAccess } from '@/lib/admin-auth';
import { withApiResilience } from '@/lib/reliability/api-resilience';

/**
 * REVIEW_APPROVAL: Admin fetches reviews with filtering and pagination
 * GET /api/reviews/admin?status=PENDING&page=1&limit=20
 */
export const GET = withApiResilience(async (request: Request) => {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canAccess(session, 50)) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';

        // Build filter using status field
        const where: Record<string, unknown> = {};
        if (status && status !== 'all') {
            where.status = status as 'PENDING' | 'APPROVED' | 'REJECTED';
        }

        // Add search filter
        if (search) {
            where.OR = [
                { customerName: { contains: search, mode: 'insensitive' as const } },
                { title: { contains: search, mode: 'insensitive' as const } },
                { comment: { contains: search, mode: 'insensitive' as const } },
            ];
        }

        const skip = (page - 1) * limit;

        // Get reviews with tour info
        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                include: {
                    tour: {
                        select: { id: true, name: true, slug: true },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.review.count({ where }),
        ]);

        // Get counts by status
        const [approvedCount, pendingCount, rejectedCount] = await Promise.all([
            prisma.review.count({ where: { status: 'APPROVED' } }),
            prisma.review.count({ where: { status: 'PENDING' } }),
            prisma.review.count({ where: { status: 'REJECTED' } }),
        ]);

        return NextResponse.json({
            reviews: reviews.map(r => ({
                id: r.id,
                customerName: r.customerName,
                customerEmail: r.customerEmail,
                title: r.title,
                comment: r.comment,
                rating: r.rating,
                status: r.status,
                isApproved: r.isApproved,
                isFeatured: r.isFeatured,
                verified: r.verified,
                rejectionReason: r.rejectionReason,
                approvedAt: r.approvedAt,
                rejectedAt: r.rejectedAt,
                tourName: r.tour?.name || 'Unknown',
                tourSlug: r.tour?.slug || '',
                tourId: r.tourId,
                createdAt: r.createdAt,
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            statusCounts: {
                PENDING: pendingCount,
                APPROVED: approvedCount,
                REJECTED: rejectedCount,
            },
        });
    } catch (error) {
        console.error('[Reviews Admin] Fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}, { route: '/api/reviews/admin', method: 'GET', requireAuth: true });
