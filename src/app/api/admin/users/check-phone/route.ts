import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const phone = request.nextUrl.searchParams.get('phone');
    
    if (!phone) {
      return NextResponse.json(
        { error: 'Phone is required' },
        { status: 400 }
      );
    }

    const user = await prisma.adminUser.findFirst({
      where: { phone },
      select: { id: true }
    });

    return NextResponse.json({
      exists: !!user,
      userId: user?.id
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check phone' },
      { status: 500 }
    );
  }
}
