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
    const inquiries = await prisma.contactInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const columns: CsvColumn[] = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'subject', label: 'Subject' },
      { key: 'tourInterest', label: 'Tour Interest' },
      { key: 'status', label: 'Status' },
      { key: 'receivedOn', label: 'Received On' },
    ];

    const data = inquiries.map(i => ({
      id: i.id,
      name: i.name,
      email: i.email,
      subject: i.subject,
      tourInterest: i.tourInterest || 'N/A',
      status: i.isReplied ? 'Replied' : i.isRead ? 'Read' : 'Unread',
      receivedOn: new Date(i.createdAt).toLocaleDateString(),
    }));

    const filename = generateCsvFilename('inquiries');
    return createCsvResponse(columns, data, filename);
  } catch (error) {
    console.error('Export inquiries error:', error);
    return NextResponse.json(
      { error: 'Failed to export inquiries' },
      { status: 500 }
    );
  }
}
