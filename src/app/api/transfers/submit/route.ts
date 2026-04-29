import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/admin-audit';
import { checkRateLimit, getClientIp } from '@/lib/security';
import { sendTransferAdminNotification } from '@/lib/email/transfer-admin-notification';
import { sendTransferCustomerConfirmation } from '@/lib/email/transfer-customer-confirmation';
import { z } from 'zod';

const transferSubmitSchema = z.object({
  vehicleType: z.string().min(1, 'Vehicle type is required'),
  vehicleName: z.string().min(1, 'Vehicle name is required'),
  transferType: z.string().min(1, 'Transfer type is required'),
  pickupLocation: z.string().min(1, 'Pickup location is required').max(200),
  dropoffLocation: z.string().min(1, 'Drop-off location is required').max(200),
  pickupDate: z.string().min(1, 'Pickup date is required'),
  pickupTime: z.string().min(1, 'Pickup time is required'),
  flightNumber: z.string().max(20).optional(),
  passengers: z.number().int().min(1).max(50),
  customerName: z.string().min(1, 'Customer name is required').max(100),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(6, 'Phone number is required').max(20),
  specialRequests: z.string().max(500).optional(),
});

function generateReferenceNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TRF-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    // Rate limiting - use booking limit for transfers
    const rateLimit = await checkRateLimit(ip, 'booking');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before submitting another transfer request.', retryAfter: rateLimit.retryAfter },
        { status: 429 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validation = transferSubmitSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.issues.map((err) => ({
        field: String(err.path.join('.')),
        message: err.message,
      }));
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    const data = validation.data;

    // Validate pickup date is not in the past
    const pickupDate = new Date(data.pickupDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (pickupDate < now) {
      return NextResponse.json(
        { error: 'Pickup date cannot be in the past' },
        { status: 400 }
      );
    }

    // Generate unique reference number
    const referenceNumber = generateReferenceNumber();

    // Save to database
    const transfer = await prisma.vehicleTransfer.create({
      data: {
        vehicleType: data.vehicleType,
        vehicleName: data.vehicleName,
        transferType: data.transferType,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        pickupDate: pickupDate,
        pickupTime: data.pickupTime,
        flightNumber: data.flightNumber || null,
        passengers: data.passengers,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        specialRequests: data.specialRequests || null,
        status: 'pending',
        referenceNumber,
      },
    });

    // Create admin notification
    await createNotification({
      type: 'NEW_BOOKING',
      title: 'New Transfer Request',
      message: `${data.customerName} (${data.customerEmail}) - ${data.vehicleName} - ${data.pickupLocation} to ${data.dropoffLocation}`,
      actionUrl: '/admin/bookings',
    });

    // Send emails (non-blocking — do not await both)
    // If either fails, log error but do NOT fail the request
    await Promise.allSettled([
      sendTransferAdminNotification({
        id: transfer.id,
        referenceNumber: transfer.referenceNumber,
        vehicleName: transfer.vehicleName,
        vehicleType: transfer.vehicleType,
        transferType: transfer.transferType,
        pickupLocation: transfer.pickupLocation,
        dropoffLocation: transfer.dropoffLocation,
        pickupDate: transfer.pickupDate,
        pickupTime: transfer.pickupTime,
        flightNumber: transfer.flightNumber,
        passengers: transfer.passengers,
        customerName: transfer.customerName,
        customerEmail: transfer.customerEmail,
        customerPhone: transfer.customerPhone,
        specialRequests: transfer.specialRequests,
        createdAt: transfer.createdAt,
      }),
      sendTransferCustomerConfirmation({
        id: transfer.id,
        referenceNumber: transfer.referenceNumber,
        vehicleName: transfer.vehicleName,
        transferType: transfer.transferType,
        pickupLocation: transfer.pickupLocation,
        dropoffLocation: transfer.dropoffLocation,
        pickupDate: transfer.pickupDate,
        pickupTime: transfer.pickupTime,
        passengers: transfer.passengers,
        customerName: transfer.customerName,
        customerEmail: transfer.customerEmail,
        createdAt: transfer.createdAt,
      }),
    ]).then((results) => {
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`[Email] ${index === 0 ? 'Admin' : 'Customer'} transfer notification failed:`, result.reason);
        } else if (!result.value.success) {
          console.error(`[Email] ${index === 0 ? 'Admin' : 'Customer'} transfer notification error:`, result.value.error);
        }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Your transfer request has been submitted. We will confirm within 2 hours.',
      referenceNumber: transfer.referenceNumber,
    }, { status: 201 });

  } catch (error) {
    console.error('[Transfer Submit] Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit transfer request. Please try again.' },
      { status: 500 }
    );
  }
}
