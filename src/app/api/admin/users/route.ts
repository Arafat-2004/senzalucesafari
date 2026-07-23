import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-auth';
import { checkRBACMiddleware } from '@/middleware/rbac';
import { hashPassword } from '@/lib/security';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/reliability/logger';

export async function POST(request: NextRequest) {
  try {
    const permissionError = await checkRBACMiddleware(request, 'users', 'CREATE');
    if (permissionError) return permissionError;

    const body = await request.json();
    const { firstName, lastName, email, phone, role, password } = body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!firstName?.trim() || !lastName?.trim() || !normalizedEmail || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const existingEmail = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail }
    });
    
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }

    const adminRole = await prisma.adminRole.findUnique({
      where: { name: role }
    });

    if (!adminRole) {
       return NextResponse.json(
         { error: `Role ${role} does not exist in database` },
         { status: 400 }
       );
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.adminUser.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        phone: phone?.trim() || null,
        roleId: adminRole.id,
        passwordHash: hashedPassword,
        isActive: true
      }
    });

    const session = await getSession();
    await prisma.adminAuditLog.create({
      data: {
        userId: session?.id || 'system',
        action: 'CREATE',
        entityType: 'admin_user',
        entityId: user.id,
        description: `Created user ${user.email} with role ${role}`
      }
    });

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: role
      }
    }, { status: 201 });
  } catch (error) {
    logger.error('User creation error', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
