import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const count = await prisma.newsletter.count();
        return NextResponse.json({
            success: true,
            count,
            env: {
                has_db_url: !!process.env.DATABASE_URL,
                db_url_prefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.slice(0, 35) : null,
                has_direct_url: !!process.env.DIRECT_URL,
                direct_url_prefix: process.env.DIRECT_URL ? process.env.DIRECT_URL.slice(0, 35) : null,
            }
        });
    } catch (e) {
        return NextResponse.json({
            success: false,
            error: e instanceof Error ? e.message : String(e),
            stack: e instanceof Error ? e.stack : null,
            env: {
                has_db_url: !!process.env.DATABASE_URL,
                db_url_prefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.slice(0, 35) : null,
                has_direct_url: !!process.env.DIRECT_URL,
                direct_url_prefix: process.env.DIRECT_URL ? process.env.DIRECT_URL.slice(0, 35) : null,
            }
        }, { status: 500 });
    }
}
