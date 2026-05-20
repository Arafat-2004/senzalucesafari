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
      select: {
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        country: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Aggregate by email
    const customerMap = new Map<string, {
      name: string;
      email: string;
      phone: string | null;
      country: string | null;
      totalBookings: number;
      registrationDate: Date;
    }>();

    for (const b of bookings) {
      const email = b.email.toLowerCase();
      const existing = customerMap.get(email);
      if (existing) {
        existing.totalBookings += 1;
      } else {
        customerMap.set(email, {
          name: `${b.firstName} ${b.lastName}`,
          email,
          phone: b.phone,
          country: b.country,
          totalBookings: 1,
          registrationDate: b.createdAt,
        });
      }
    }

    const columns: CsvColumn[] = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'country', label: 'Country' },
      { key: 'totalBookings', label: 'Total Bookings' },
      { key: 'registrationDate', label: 'Registration Date' },
    ];

    const data = Array.from(customerMap.values()).map((c, idx) => ({
      id: `CUST-${String(idx + 1).padStart(4, '0')}`,
      name: c.name,
      email: c.email,
      phone: c.phone || 'N/A',
      country: c.country || 'N/A',
      totalBookings: c.totalBookings,
      registrationDate: new Date(c.registrationDate).toLocaleDateString(),
    }));

    const filename = generateCsvFilename('customers');
    return createCsvResponse(columns, data, filename);
  } catch (error) {
    logger.error('Export customers error', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: 'Failed to export customers' },
      { status: 500 }
    );
  }
}
