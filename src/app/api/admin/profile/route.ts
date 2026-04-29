import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/admin-auth';
import { verifyPassword, hashPassword } from '@/lib/security';
import { z } from 'zod';
import { withApiResilience } from '@/lib/reliability/api-resilience';

const profileUpdateSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    phone: z.string().max(20).optional(),
    avatar: z.string().url().optional(),
    jobTitle: z.string().max(100).optional(),
    language: z.string().max(10).optional(),
    timezone: z.string().max(50).optional(),
});

const passwordChangeSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain uppercase letter')
        .regex(/[a-z]/, 'Password must contain lowercase letter')
        .regex(/[0-9]/, 'Password must contain a number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain special character'),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const GET = withApiResilience(async () => {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.adminUser.findUnique({
        where: { id: session.id },
        include: { role: true },
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            phone: user.phone,
            jobTitle: user.jobTitle,
            language: user.language,
            timezone: user.timezone,
            role: { id: user.role.id, name: user.role.name, displayName: user.role.displayName },
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            failedAttempts: user.failedAttempts,
            isActive: user.isActive,
        }
    });
}, { route: '/api/admin/profile', method: 'GET', requireAuth: true });

export const PATCH = withApiResilience(async (request: Request) => {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = profileUpdateSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(
            { error: 'Validation failed', details: validation.error.issues },
            { status: 400 }
        );
    }

    const data = validation.data;
    const user = await prisma.adminUser.update({
        where: { id: session.id },
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone || null,
            avatar: data.avatar || null,
            jobTitle: data.jobTitle || null,
            language: data.language || null,
            timezone: data.timezone || null,
        },
        include: { role: true },
    });

    return NextResponse.json({
        success: true,
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            phone: user.phone,
            jobTitle: user.jobTitle,
            language: user.language,
            timezone: user.timezone,
        },
    });
}, { route: '/api/admin/profile', method: 'PATCH', requireAuth: true });

export const PUT = withApiResilience(async (request: Request) => {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = passwordChangeSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(
            { error: 'Validation failed', details: validation.error.issues },
            { status: 400 }
        );
    }

    const { currentPassword, newPassword } = validation.data;
    const user = await prisma.adminUser.findUnique({
        where: { id: session.id },
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const validPassword = await verifyPassword(currentPassword, user.passwordHash);
    
    if (!validPassword) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    const newHash = await hashPassword(newPassword);
    
    await prisma.adminUser.update({
        where: { id: session.id },
        data: { passwordHash: newHash },
    });

    return NextResponse.json({
        success: true,
        message: 'Password changed successfully',
    });
}, { route: '/api/admin/profile', method: 'PUT', requireAuth: true, slowThresholdMs: 300 })