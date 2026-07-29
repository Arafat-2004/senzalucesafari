import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/reliability/logger";
import { Prisma } from "@/generated/prisma/client";
import { sanitizeAnalyticsParams, type AnalyticsEventParams } from "@/lib/analytics/ga4";

const SAFE_EVENT_NAME = /^[a-z][a-z0-9_]{0,63}$/;
const SAFE_CONTEXT = /^[a-z0-9_-]{1,64}$/i;

export async function POST(request: NextRequest) {
    try {
        const body: unknown = await request.json();
        if (!body || typeof body !== 'object') {
            return NextResponse.json({ error: 'Invalid analytics payload' }, { status: 400 });
        }

        const payload = body as Record<string, unknown>;
        const eventName = typeof payload.eventName === 'string' ? payload.eventName.trim() : '';
        const eventType = typeof payload.eventType === 'string' && SAFE_CONTEXT.test(payload.eventType)
            ? payload.eventType
            : 'custom';
        const context = typeof payload.context === 'string' && SAFE_CONTEXT.test(payload.context)
            ? payload.context
            : undefined;
        const page = typeof payload.page === 'string'
            && payload.page.startsWith('/')
            && !payload.page.startsWith('/admin')
            ? payload.page.split(/[?#]/, 1)[0].slice(0, 200)
            : undefined;
        const safeMetadata = sanitizeAnalyticsParams(
            payload.metadata && typeof payload.metadata === 'object'
                ? payload.metadata as AnalyticsEventParams
                : {},
        );
        const tourId = sanitizeAnalyticsParams({
            tour_id: typeof payload.tourId === 'string' ? payload.tourId : undefined,
        }).tour_id;

        if (!SAFE_EVENT_NAME.test(eventName)) {
            return NextResponse.json({ error: 'Valid eventName is required' }, { status: 400 });
        }

        const event = await prisma.analyticsEvent.create({
            data: {
                eventName,
                eventType,
                context,
                tourId,
                page,
                metadata: safeMetadata as Prisma.InputJsonValue,
            },
        });

        return NextResponse.json({ success: true, eventId: event.id });
    } catch (error) {
        logger.error('Analytics event logging error', { error: error instanceof Error ? error.message : String(error) });
        return NextResponse.json({ error: 'Failed to log event' }, { status: 500 });
    }
}
