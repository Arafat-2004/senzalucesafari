import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/admin-audit';
import { checkRateLimit, getClientIp, sanitizeInput } from '@/lib/security';
import { getSession, canAccess } from '@/lib/admin-auth';
import { calculateSafariPrice } from '@/lib/pricing-engine';
import { z } from 'zod';
import { withApiResilience } from '@/lib/reliability/api-resilience';

/**
 * Bookings API Route
 * 
 * POST /api/bookings - Create a new booking
 * GET /api/bookings - Get all bookings (admin only)
 * All prices are calculated server-side for security
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
    numberOfTravelers: z.number().int().min(1).max(20, 'Maximum 20 travelers per booking'),
    accommodationLevel: z.enum(['budget', 'mid-range', 'luxury', 'premium']),
    specialRequests: z.string().max(2000).optional(),
    source: z.string().optional().default('website'),
});

function generateBookingRef(): string {
    const prefix = 'SLS';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

export const POST = withApiResilience(async (request: Request) => {
    try {
        // Rate limiting
        const ip = getClientIp(request);

        const rateLimit = await checkRateLimit(ip, 'booking');
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

        // Fetch tour for pricing calculation
        const tour = await prisma.tour.findUnique({
            where: { id: data.tourId },
        });

        if (!tour || !tour.isActive) {
            return NextResponse.json(
                { error: 'Tour not found or unavailable' },
                { status: 404 }
            );
        }

        // SERVER-SIDE PRICE CALCULATION
        // Calculate price using the same engine as frontend
        const pricing = calculateSafariPrice(
            tour.priceFrom || 0,
            data.numberOfTravelers,
            data.accommodationLevel
        );

        // Validate accommodation level
        const validAccommodation = ['budget', 'mid-range', 'luxury', 'premium'].includes(data.accommodationLevel)
            ? data.accommodationLevel
            : 'mid-range';

        // Calculate end date if not provided
        const endDate = data.endDate || (() => {
            const start = new Date(data.travelDate);
            const daysMatch = tour.duration.match(/(\d+)\s*days?/);
            const days = daysMatch ? parseInt(daysMatch[1]) : 1;
            start.setDate(start.getDate() + days);
            return start.toISOString();
        })();

        // Create booking with server-calculated prices
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
                accommodationLevel: validAccommodation,
                pricePerPerson: pricing.pricePerPerson,
                totalPrice: pricing.totalPrice,
                specialRequests: data.specialRequests,
                source: data.source,
                ipAddress: ip,
                userAgent: request.headers.get('user-agent'),
            },
        });

        // Create admin notification (non-blocking)
        createNotification({
            type: "NEW_BOOKING",
            title: "New Booking Received",
            message: `Booking ${booking.bookingRef} for ${tour.name} from ${data.firstName} ${data.lastName} (${data.email})`,
            actionUrl: "/admin/bookings",
        }).catch(err => console.error('[Booking] Notification error:', err));

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
}, { route: '/api/bookings', method: 'POST' });

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
}, { route: '/api/bookings', method: 'GET' });
