import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/admin-audit';
import { checkRateLimit, getClientIp, sanitizeInput } from '@/lib/security';
import { getSession, canAccess } from '@/lib/admin-auth';
import { z } from 'zod';
import { withApiResilience } from '@/lib/reliability/api-resilience';

/**
 * Enquiries API Route
 * 
 * POST /api/enquiries - Submit a new enquiry
 * GET /api/enquiries - Get all enquiries (admin only)
 */

// Validation schema for enquiry submission
const enquirySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(200),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(6, 'Invalid phone number').max(20).optional(),
    country: z.string().max(100).optional(),
    subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
    message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
    inquiryType: z.enum([
        'GENERAL',
        'TOUR_INQUIRY',
        'CUSTOM_SAFARI',
        'PRICING',
        'AVAILABILITY',
        'SUPPORT',
        'PARTNERSHIP',
        'FEEDBACK',
    ]).default('GENERAL'),
    tourInterest: z.string().max(200).optional(),
    travelDate: z.string().optional(),
    numberOfTravelers: z.number().int().min(1).max(50).optional(),
    source: z.string().optional().default('contact_form'),
});

export const POST = withApiResilience(async (request: Request) => {
    try {
        // Rate limiting
        const ip = getClientIp(request);

        const rateLimit = await checkRateLimit(ip, 'enquiry');
        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Too many requests. Please wait before submitting another enquiry.',
                    retryAfter: rateLimit.retryAfter,
                },
                { status: 429 }
            );
        }

        // Parse and validate request body
        const body = await request.json();
        const validation = enquirySchema.safeParse(body);

        if (!validation.success) {
            const errors = validation.error.issues.map((err) => ({
                field: String(err.path.join('.')),
                message: err.message,
            }));

            return NextResponse.json(
                { error: 'Validation failed', details: errors },
                { status: 400 }
            );
        }

        const data = validation.data;

        // Sanitize input fields to prevent XSS
        const sanitizedData = {
            name: sanitizeInput(data.name),
            email: data.email.toLowerCase().trim(),
            phone: data.phone ? sanitizeInput(data.phone) : undefined,
            country: data.country ? sanitizeInput(data.country) : undefined,
            subject: sanitizeInput(data.subject),
            message: sanitizeInput(data.message),
            inquiryType: data.inquiryType,
            tourInterest: data.tourInterest ? sanitizeInput(data.tourInterest) : undefined,
            travelDate: data.travelDate,
            numberOfTravelers: data.numberOfTravelers,
            source: data.source,
            ipAddress: ip,
        };

        // Create enquiry
        const enquiry = await prisma.contactInquiry.create({
            data: sanitizedData,
        });

        // Create admin notification
        await createNotification({
            type: "NEW_INQUIRY",
            title: "New Inquiry Received",
            message: `${sanitizedData.name} (${sanitizedData.email}): ${sanitizedData.subject}`,
            actionUrl: "/admin/inquiries",
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Enquiry submitted successfully. We\'ll respond within 24 hours.',
                enquiryId: enquiry.id,
            },
            { status: 201 }
        );
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('[Enquiries] Submission error:', error);
        }

        return NextResponse.json(
            { error: 'Failed to submit enquiry. Please try again.' },
            { status: 500 }
        );
    }
}, { route: '/api/enquiries', method: 'POST' });

export const GET = withApiResilience(async (request: Request) => {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!canAccess(session, 50)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const inquiryType = searchParams.get('type');
        const isRead = searchParams.get('isRead');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const where: Record<string, unknown> = {};
        if (inquiryType) where.inquiryType = inquiryType;
        if (isRead !== null) where.isRead = isRead === 'true';

        const [enquiries, total] = await Promise.all([
            prisma.contactInquiry.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.contactInquiry.count({ where }),
        ]);

        return NextResponse.json({
            enquiries,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('[Enquiries] Fetch error:', error);
        }

        return NextResponse.json(
            { error: 'Failed to fetch enquiries' },
            { status: 500 }
        );
    }
}, { route: '/api/enquiries', method: 'GET' });
