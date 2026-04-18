import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/admin-audit';
import { z } from 'zod';

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

// Rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5; // 5 enquiries per 10 minutes

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const record = rateLimitStore.get(ip);

    if (!record || now > record.resetTime) {
        rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
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
        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';

        const rateLimit = checkRateLimit(ip);
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

        // Create enquiry
        const enquiry = await prisma.contactInquiry.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                country: data.country,
                subject: data.subject,
                message: data.message,
                inquiryType: data.inquiryType,
                tourInterest: data.tourInterest,
                travelDate: data.travelDate ? new Date(data.travelDate) : null,
                numberOfTravelers: data.numberOfTravelers,
                source: data.source,
                ipAddress: ip,
            },
        });

        // Create admin notification
        await createNotification({
            type: "NEW_INQUIRY",
            title: "New Inquiry Received",
            message: `${data.name} (${data.email}): ${data.subject}`,
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
}

export async function GET(request: Request) {
    try {
        // TODO: Add admin authentication check

        const { searchParams } = new URL(request.url);
        const inquiryType = searchParams.get('type');
        const isRead = searchParams.get('isRead');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {};
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
}
