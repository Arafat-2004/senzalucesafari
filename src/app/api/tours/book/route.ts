import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/admin-audit';
import { checkRateLimit, getClientIp } from '@/lib/security';
import { sendTourBookingAdminNotification } from '@/lib/email/tour-booking-admin-notification';
import { sendTourBookingCustomerConfirmation } from '@/lib/email/tour-booking-customer-confirmation';
import { calculateSafariPrice } from '@/lib/pricing-engine';
import { z } from 'zod';
import { logger } from '@/lib/reliability/logger';

const tourBookingSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone number is required').max(20),
  country: z.string().max(100).optional(),
  countryCode: z.string().max(10).optional(),
  tourId: z.string().min(1, 'Tour ID is required'),
  tourName: z.string().min(1, 'Tour name is required'),
  tourSlug: z.string().min(1, 'Tour slug is required'),
  travelDate: z.string().min(1, 'Travel date is required'),
  endDate: z.string().min(1, 'End date is required'),
  numberOfTravelers: z.number().int().min(1).max(50),
  accommodationLevel: z.string().min(1, 'Accommodation level is required'),
  specialRequests: z.string().max(1000).optional(),
  basePrice: z.number().min(0).optional(),
  totalPrice: z.number().min(0).optional(),
  currency: z.string().default('USD'),
});

function generateReferenceNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TBK-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    // Rate limiting
    const rateLimit = await checkRateLimit(ip, 'booking');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before submitting another booking.', retryAfter: rateLimit.retryAfter },
        { status: 429 }
      );
    }

    // Safely parse JSON request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body' },
        { status: 400 }
      );
    }

    // Validate request body schema
    const validation = tourBookingSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.issues.map((err) => ({
        field: String(err.path.join('.')),
        message: err.message,
      }));
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    const data = validation.data;

    // Validate travel date is not in the past
    const travelDate = new Date(data.travelDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (isNaN(travelDate.getTime()) || travelDate < now) {
      return NextResponse.json(
        { error: 'Travel date cannot be in the past or invalid' },
        { status: 400 }
      );
    }

    // Fetch the tour from the database for server-side price calculation
    const tour = await prisma.tour.findUnique({
      where: { id: data.tourId }
    });

    if (!tour || !tour.isActive) {
      return NextResponse.json({ error: 'Tour not found or is inactive' }, { status: 404 });
    }

    // Server-side price calculation to prevent price tampering
    const pricing = calculateSafariPrice(
      tour.priceFrom || 0,
      data.numberOfTravelers,
      data.accommodationLevel
    );

    // Retry loop for unique bookingRef generation (P2002 conflict)
    let booking;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      const referenceNumber = generateReferenceNumber();
      try {
        booking = await prisma.booking.create({
          data: {
            bookingRef: referenceNumber,
            tourId: data.tourId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            country: data.country || '',
            countryCode: data.countryCode,
            travelDate: travelDate,
            endDate: new Date(data.endDate),
            numberOfTravelers: data.numberOfTravelers,
            accommodationLevel: data.accommodationLevel,
            pricePerPerson: pricing.pricePerPerson,
            totalPrice: pricing.totalPrice,
            currency: data.currency,
            status: 'PENDING',
            paymentStatus: 'PENDING',
            specialRequests: data.specialRequests || null,
            source: 'website',
            ipAddress: ip,
          },
        });
        break;
      } catch (err: any) {
        if (err.code === 'P2002') {
          attempts++;
          if (attempts >= maxAttempts) {
            logger.error('[Tour Booking Submit] Booking reference collision limit reached', { error: err.message });
            throw err;
          }
        } else {
          throw err;
        }
      }
    }

    if (!booking) {
      return NextResponse.json(
        { error: 'Failed to save booking. Please try again.' },
        { status: 500 }
      );
    }

    // Create admin notification (non-blocking)
    createNotification({
      type: 'NEW_BOOKING',
      title: 'New Safari Booking',
      message: `${data.firstName} ${data.lastName} (${data.email}) - ${data.tourName} - ${data.numberOfTravelers} travelers`,
      actionUrl: '/admin/bookings',
    }).catch(err => logger.error('[Booking] Notification error', { error: err instanceof Error ? err.message : String(err) }));

    // Send emails (non-blocking)
    Promise.allSettled([
      sendTourBookingAdminNotification({
        id: booking.id,
        referenceNumber: booking.bookingRef,
        tourName: data.tourName,
        tourSlug: data.tourSlug,
        travelDate: booking.travelDate,
        endDate: booking.endDate,
        numberOfTravelers: booking.numberOfTravelers,
        accommodationLevel: booking.accommodationLevel,
        specialRequests: booking.specialRequests,
        firstName: booking.firstName,
        lastName: booking.lastName,
        email: booking.email,
        phone: booking.phone,
        country: booking.country,
        totalPrice: booking.totalPrice,
        currency: booking.currency,
        createdAt: booking.createdAt,
      }),
      sendTourBookingCustomerConfirmation({
        referenceNumber: booking.bookingRef,
        tourName: data.tourName,
        travelDate: booking.travelDate,
        endDate: booking.endDate,
        numberOfTravelers: booking.numberOfTravelers,
        accommodationLevel: booking.accommodationLevel,
        customerName: `${booking.firstName} ${booking.lastName}`,
        customerEmail: booking.email,
        createdAt: booking.createdAt,
      }),
    ]).then((results) => {
      // Log any failures in email sending
      results.forEach((result, idx) => {
        if (result.status === 'rejected') {
          logger.error(`[Booking] Email task ${idx === 0 ? 'Admin' : 'Customer'} failed`, { error: String(result.reason) });
        }
      });
    }).catch(err => logger.error('[Booking] Email settled tasks error', { error: err instanceof Error ? err.message : String(err) }));

    return NextResponse.json({
      success: true,
      message: 'Your safari booking request has been submitted. Our team will contact you within 24 hours.',
      referenceNumber: booking.bookingRef,
    }, { status: 201 });

  } catch (error) {
    logger.error('[Tour Booking Submit] General Error', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: 'Failed to submit booking request. Please try again.' },
      { status: 500 }
    );
  }
}
