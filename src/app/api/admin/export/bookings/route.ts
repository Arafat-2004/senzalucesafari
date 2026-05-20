import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { createCsvResponse, generateCsvFilename, CsvColumn } from '@/lib/export/csv';
import { logger } from '@/lib/reliability/logger';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tour: { select: { name: true } },
      },
    });

    const columns: CsvColumn[] = [
      { key: 'id', label: 'ID' },
      { key: 'customerName', label: 'Customer Name' },
      { key: 'customerEmail', label: 'Customer Email' },
      { key: 'tourName', label: 'Tour Name' },
      { key: 'travelDate', label: 'Travel Date' },
      { key: 'guests', label: 'Guests' },
      { key: 'totalPrice', label: 'Total Price' },
      { key: 'status', label: 'Status' },
      { key: 'bookedOn', label: 'Booked On' },
    ];

    const data = bookings.map(b => ({
      id: b.bookingRef,
      customerName: `${b.firstName} ${b.lastName}`,
      customerEmail: b.email,
      tourName: b.tour.name,
      travelDate: new Date(b.travelDate).toLocaleDateString(),
      guests: b.numberOfTravelers,
      totalPrice: `${b.currency} ${b.totalPrice.toFixed(2)}`,
      status: b.status,
      bookedOn: new Date(b.createdAt).toLocaleDateString(),
    }));

    const filename = generateCsvFilename('bookings');
    return createCsvResponse(columns, data, filename);
  } catch (error) {
    logger.error('Export bookings error', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: 'Failed to export bookings' },
      { status: 500 }
    );
  }
}
