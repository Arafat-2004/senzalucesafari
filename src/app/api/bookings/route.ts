import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/admin-audit';
import { z } from 'zod';

/**
 * Bookings API Route
 * 
 * POST /api/bookings - Create a new booking
 * GET /api/bookings - Get all bookings (admin only)
 */

// Validation schema for booking creation
const bookingSchema = z.object({
    tourId: z.string().uuid('Invalid tour ID'),
    firstName: z.string().min(2, 'First name must be at least 2 characters').max(100),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(6, 'Invalid phone number').max(20),
    country: z.string().min(2).max(100),
    countryCode: z.string().optional(),
    travelDate: z.string().refine((val) => {
        const date = new Date(val);
        return date > new Date();
    }, 'Travel date must be in the future'),
    endDate: z.string().optional(),
    numberOfTravelers: z.number().int().min(1).max(50, 'Maximum 50 travelers'),
    accommodationLevel: z.enum(['luxury', 'mid-range', 'budget']),
    pricePerPerson: z.number().positive('Price must be positive'),
    totalPrice: z.number().positive('Total price must be positive'),
    specialRequests: z.string().max(2000).optional(),
    source: z.string().optional().default('website'),
});

// Rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX = 3; // 3 bookings per 5 minutes per IP

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

function generateBookingRef(): string {
    const prefix = 'SLS';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
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
                    error: 'Too many booking attempts. Please wait before trying again.',
                    retryAfter: rateLimit.retryAfter,
                },
                { status: 429 }
            );
        }

        // Parse and validate request body
        const body = await request.json();
        const validation = bookingSchema.safeParse(body);

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

        // Verify tour exists
        const tour = await prisma.tour.findUnique({
            where: { id: data.tourId },
        });

        if (!tour || !tour.isActive) {
            return NextResponse.json(
                { error: 'Tour not found or unavailable' },
                { status: 404 }
            );
        }

        // Calculate end date if not provided
        const endDate = data.endDate || (() => {
            const start = new Date(data.travelDate);
            // Extract duration from tour (e.g., "5 days / 4 nights")
            const daysMatch = tour.duration.match(/(\d+)\s*days?/);
            const days = daysMatch ? parseInt(daysMatch[1]) : 1;
            start.setDate(start.getDate() + days);
            return start.toISOString();
        })();

        // Create booking
        const booking = await prisma.booking.create({
            data: {
                bookingRef: generateBookingRef(),
                tourId: data.tourId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                country: data.country,
                countryCode: data.countryCode,
                travelDate: new Date(data.travelDate),
                endDate: new Date(endDate),
                numberOfTravelers: data.numberOfTravelers,
                accommodationLevel: data.accommodationLevel,
                pricePerPerson: data.pricePerPerson,
                totalPrice: data.totalPrice,
                specialRequests: data.specialRequests,
                source: data.source,
                ipAddress: ip,
                userAgent: request.headers.get('user-agent'),
            },
        });

        // Create admin notification
        await createNotification({
            type: "NEW_BOOKING",
            title: "New Booking Received",
            message: `Booking ${booking.bookingRef} for ${tour.name} from ${data.firstName} ${data.lastName} (${data.email})`,
            actionUrl: "/admin/bookings",
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Booking created successfully',
                booking: {
                    id: booking.id,
                    bookingRef: booking.bookingRef,
                    tourName: tour.name,
                    travelDate: booking.travelDate,
                    totalPrice: booking.totalPrice,
                    currency: booking.currency,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('[Bookings] Creation error:', error);
        }

        return NextResponse.json(
            { error: 'Failed to create booking. Please try again.' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        // TODO: Add admin authentication check

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const where = status ? { status: status as 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' } : {};

        const [bookings, total] = await Promise.all([
            prisma.booking.findMany({
                where,
                include: {
                    tour: {
                        select: {
                            name: true,
                            slug: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.booking.count({ where }),
        ]);

        return NextResponse.json({
            bookings,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('[Bookings] Fetch error:', error);
        }

        return NextResponse.json(
            { error: 'Failed to fetch bookings' },
            { status: 500 }
        );
    }
}
