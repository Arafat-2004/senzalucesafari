import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/admin-audit';
import { checkRateLimit, getClientIp } from '@/lib/security';
import { sendTourBookingAdminNotification } from '@/lib/email/tour-booking-admin-notification';
import { sendTourBookingCustomerConfirmation } from '@/lib/email/tour-booking-customer-confirmation';
import { z } from 'zod';

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
  basePrice: z.number().min(0),
  totalPrice: z.number().min(0),
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

    // Validate request body
    const body = await request.json();
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
    if (travelDate < now) {
      return NextResponse.json(
        { error: 'Travel date cannot be in the past' },
        { status: 400 }
      );
    }

    // Generate unique reference number
    const referenceNumber = generateReferenceNumber();

    // Save to database
    const booking = await prisma.booking.create({
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
        pricePerPerson: data.basePrice,
        totalPrice: data.totalPrice,
        currency: data.currency,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        specialRequests: data.specialRequests || null,
        source: 'website',
        ipAddress: ip,
      },
    });

    // Create admin notification (non-blocking)
    createNotification({
      type: 'NEW_BOOKING',
      title: 'New Safari Booking',
      message: `${data.firstName} ${data.lastName} (${data.email}) - ${data.tourName} - ${data.numberOfTravelers} travelers`,
      actionUrl: '/admin/bookings',
    }).catch(err => console.error('[Booking] Notification error:', err));

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
    ]).catch(err => console.error('[Booking] Email error:', err));

    return NextResponse.json({
      success: true,
      message: 'Your safari booking request has been submitted. Our team will contact you within 24 hours.',
      referenceNumber: booking.bookingRef,
    }, { status: 201 });

  } catch (error) {
    console.error('[Tour Booking Submit] Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit booking request. Please try again.' },
      { status: 500 }
    );
  }
}
