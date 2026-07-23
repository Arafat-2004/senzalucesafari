import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await prisma.adminUser.findUnique({
      where: { email },
      select: { id: true }
    });

    return NextResponse.json({
      exists: !!user,
      userId: user?.id
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to check email' },
      { status: 500 }
    );
  }
}
