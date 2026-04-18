import { NextResponse } from 'next/server';
import { subscribeNewsletter } from '@/lib/db/newsletter';

/**
 * Newsletter Subscription API Route
 * 
 * Features:
 * - Rate limiting (1 request per minute per IP)
 * - Email validation
 * - Caching headers for better performance
 * - Integration-ready for Mailchimp/ConvertKit/etc
 */

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 1; // 1 request per minute per IP

function getRateLimitKey(request: Request): string {
    // In production, use request.ip or x-forwarded-for
    const forwardedFor = request.headers.get('x-forwarded-for');
    return forwardedFor || request.headers.get('x-real-ip') || 'unknown';
}

function checkRateLimit(key: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
        // First request or window expired
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW
        });
        return { allowed: true };
    }

    if (record.count >= RATE_LIMIT_MAX) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);
        return { allowed: false, retryAfter };
    }

    record.count++;
    return { allowed: true };
}

export async function POST(request: Request) {
    try {
        // Rate limiting
        const rateLimitKey = getRateLimitKey(request);
        const rateLimit = checkRateLimit(rateLimitKey);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Too many requests. Please try again later.',
                    retryAfter: rateLimit.retryAfter
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': rateLimit.retryAfter?.toString() || '60',
                        'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': new Date(Date.now() + (rateLimit.retryAfter || 60) * 1000).toISOString()
                    }
                }
            );
        }

        const { email } = await request.json();

        // Validate email
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Subscribe to database
        const result = await subscribeNewsletter(email);

        return NextResponse.json(
            {
                success: result.success,
                message: result.message,
            },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString()
                }
            }
        );
    } catch (error) {
        console.error('[Newsletter] Subscription error:', error);

        return NextResponse.json(
            {
                error: 'Failed to subscribe. Please try again.',
                details: process.env.NODE_ENV === 'development' ? error : undefined
            },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store'
                }
            }
        );
    }
}
