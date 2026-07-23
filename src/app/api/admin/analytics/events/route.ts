import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, canAccess } from "@/lib/admin-auth";
import { logger } from "@/lib/reliability/logger";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!canAccess(session, 50)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const body = await request.json();
        const { eventName, eventType, context, tourId, page, metadata, startDate, endDate, limit = 100, offset = 0 } = body;

        const where: Record<string, unknown> = {};

        if (eventName) where.eventName = { contains: eventName, mode: 'insensitive' };
        if (eventType) where.eventType = eventType;
        if (tourId) where.tourId = tourId;
        if (context) where.context = { contains: context, mode: 'insensitive' };
        if (startDate || endDate) {
            where.timestamp = {};
            if (startDate) (where.timestamp as Record<string, Date>).gte = new Date(startDate);
            if (endDate) (where.timestamp as Record<string, Date>).lte = new Date(endDate);
        }

        const [events, total] = await Promise.all([
            prisma.analyticsEvent.findMany({
                where,
                orderBy: { timestamp: 'desc' },
                take: limit,
                skip: offset,
            }),
            prisma.analyticsEvent.count({ where }),
        ]);

        return NextResponse.json({ events, total, limit, offset });
    } catch (error) {
        logger.error('Analytics query error', { error: error instanceof Error ? error.message : String(error) });
        return NextResponse.json({ error: 'Failed to query analytics' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || 'all';

        let cutoffDate: Date | null = null;
        if (range === '7d') {
            cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - 7);
        } else if (range === '30d') {
            cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - 30);
        } else if (range === '90d') {
            cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - 90);
        }

        const [totalEvents, eventsByType, eventsByName, ctaByContext, eventsByTour, recentEvents] = await Promise.all([
            cutoffDate ? prisma.analyticsEvent.count({ where: { timestamp: { gte: cutoffDate } } }) : prisma.analyticsEvent.count(),
            
            cutoffDate 
                ? prisma.$queryRaw<Array<{ eventType: string; _count: bigint }>>`
                    SELECT "eventType", COUNT(*) as _count
                    FROM analytics_events
                    WHERE timestamp >= ${cutoffDate}
                    GROUP BY "eventType"
                    ORDER BY _count DESC
                `
                : prisma.$queryRaw<Array<{ eventType: string; _count: bigint }>>`
                    SELECT "eventType", COUNT(*) as _count
                    FROM analytics_events
                    GROUP BY "eventType"
                    ORDER BY _count DESC
                `,

            cutoffDate
                ? prisma.$queryRaw<Array<{ eventName: string; _count: bigint }>>`
                    SELECT "eventName", COUNT(*) as _count
                    FROM analytics_events
                    WHERE timestamp >= ${cutoffDate}
                    GROUP BY "eventName"
                    ORDER BY _count DESC
                    LIMIT 20
                `
                : prisma.$queryRaw<Array<{ eventName: string; _count: bigint }>>`
                    SELECT "eventName", COUNT(*) as _count
                    FROM analytics_events
                    GROUP BY "eventName"
                    ORDER BY _count DESC
                    LIMIT 20
                `,

            cutoffDate
                ? prisma.$queryRaw<Array<{ context: string; _count: bigint }>>`
                    SELECT "context", COUNT(*) as _count
                    FROM analytics_events
                    WHERE "eventType" = 'cta' AND timestamp >= ${cutoffDate}
                    GROUP BY "context"
                    ORDER BY _count DESC
                `
                : prisma.$queryRaw<Array<{ context: string; _count: bigint }>>`
                    SELECT "context", COUNT(*) as _count
                    FROM analytics_events
                    WHERE "eventType" = 'cta'
                    GROUP BY "context"
                    ORDER BY _count DESC
                `,

            cutoffDate
                ? prisma.$queryRaw<Array<{ tourId: string | null; _count: bigint }>>`
                    SELECT "tourId", COUNT(*) as _count
                    FROM analytics_events
                    WHERE "tourId" IS NOT NULL AND timestamp >= ${cutoffDate}
                    GROUP BY "tourId"
                    ORDER BY _count DESC
                    LIMIT 10
                `
                : prisma.$queryRaw<Array<{ tourId: string | null; _count: bigint }>>`
                    SELECT "tourId", COUNT(*) as _count
                    FROM analytics_events
                    WHERE "tourId" IS NOT NULL
                    GROUP BY "tourId"
                    ORDER BY _count DESC
                    LIMIT 10
                `,

            prisma.analyticsEvent.findMany({
                where: cutoffDate ? { timestamp: { gte: cutoffDate } } : {},
                orderBy: { timestamp: 'desc' },
                take: 50,
            }),
        ]);

        return NextResponse.json({
            totalEvents,
            eventsByType: eventsByType.map((r: { eventType: string; _count: bigint }) => ({ eventType: r.eventType, _count: Number(r._count) })),
            eventsByName: eventsByName.map((r: { eventName: string; _count: bigint }) => ({ eventName: r.eventName, _count: Number(r._count) })),
            ctaByContext: ctaByContext.map((r: { context: string; _count: bigint }) => ({ context: r.context, _count: Number(r._count) })),
            eventsByTour: eventsByTour.map((r: { tourId: string | null; _count: bigint }) => ({ tourId: r.tourId, _count: Number(r._count) })),
            recentEvents,
        });
    } catch (error) {
        logger.error('Analytics GET error', { error: error instanceof Error ? error.message : String(error) });
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}