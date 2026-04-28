import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { createCsvResponse, generateCsvFilename, CsvColumn } from '@/lib/export/csv';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tours = await prisma.tour.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        destinations: {
          include: { destination: { select: { name: true } } },
        },
        _count: {
          select: { bookings: true },
        },
      },
    });

    const columns: CsvColumn[] = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'destination', label: 'Destination' },
      { key: 'duration', label: 'Duration' },
      { key: 'price', label: 'Price' },
      { key: 'status', label: 'Status' },
      { key: 'totalBookings', label: 'Total Bookings' },
    ];

    const data = tours.map(t => ({
      id: t.id,
      name: t.name,
      destination: t.destinations.map(d => d.destination.name).join(', ') || 'N/A',
      duration: t.duration,
      price: `$${t.priceFrom.toFixed(2)}`,
      status: t.isActive ? 'Active' : 'Inactive',
      totalBookings: t._count.bookings,
    }));

    const filename = generateCsvFilename('tours');
    return createCsvResponse(columns, data, filename);
  } catch (error) {
    console.error('Export tours error:', error);
    return NextResponse.json(
      { error: 'Failed to export tours' },
      { status: 500 }
    );
  }
}
