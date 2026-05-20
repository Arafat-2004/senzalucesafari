import { NextResponse } from 'next/server';
import { subscribeNewsletter } from '@/lib/db/newsletter';
import { checkRateLimit, getClientIp, isValidEmail } from '@/lib/security';
import { withApiResilience } from '@/lib/reliability/api-resilience';
import { createNotification } from '@/lib/admin-audit';
import { logger } from '@/lib/reliability/logger';

/**
 * Newsletter Subscription API Route
 * 
 * Features:
 * - Rate limiting (1 request per minute per IP)
 * - Email validation
 * - Caching headers for better performance
 * - Integration-ready for Mailchimp/ConvertKit/etc
 */

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 1;

export const POST = withApiResilience(async (request: Request) => {
    try {
        // Rate limiting
        const ip = getClientIp(request);
        const rateLimit = await checkRateLimit(ip, 'general');

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
        if (!email || !isValidEmail(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Subscribe to database
        const newsletterResult = await subscribeNewsletter(email);

        // NOTIFICATION_REDESIGN: Create notification for new newsletter signup (only for new subs)
        if (newsletterResult.success && !newsletterResult.alreadySubscribed) {
            createNotification({
                type: 'NEW_NEWSLETTER_SIGNUP',
                title: 'New Newsletter Subscriber',
                message: `${email} subscribed to newsletter`,
                actionUrl: '/admin/newsletter',
            }).catch(err => logger.error('[Newsletter] Notification error', { error: err instanceof Error ? err.message : String(err) }));
        }

        return NextResponse.json(
            {
                success: newsletterResult.success,
                message: newsletterResult.message,
            },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                }
            }
        );
    } catch (error) {
        logger.error('[Newsletter] Subscription error', { error: error instanceof Error ? error.message : String(error) });

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
}, { route: '/api/newsletter/subscribe', method: 'POST', throttleMs: 150 });
