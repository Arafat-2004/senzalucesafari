import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/reliability/logger";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { eventName, eventType = 'custom', context, tourId, page, metadata } = body;

        if (!eventName) {
            return NextResponse.json({ error: 'eventName is required' }, { status: 400 });
        }

        const ipAddress = request.headers.get('x-forwarded-for') || 
                         request.headers.get('x-real-ip') || 
                         undefined;
        const userAgent = request.headers.get('user-agent') || undefined;

        const event = await prisma.analyticsEvent.create({
            data: {
                eventName,
                eventType,
                context,
                tourId,
                page,
                metadata: metadata || {},
                ipAddress,
                userAgent,
            },
        });

        return NextResponse.json({ success: true, eventId: event.id });
    } catch (error) {
        logger.error('Analytics event logging error', { error: error instanceof Error ? error.message : String(error) });
        return NextResponse.json({ error: 'Failed to log event' }, { status: 500 });
    }
}