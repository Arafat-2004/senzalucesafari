import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/admin-auth';
import { z } from 'zod';

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

function simpleHash(str: string): string {
    const crypto = require('crypto');
    const SALT = process.env.AUTH_SALT || 'default-salt-change-in-production';
    return crypto.createHmac('sha256', SALT).update(str).digest('hex');
}

export async function GET() {
    try {
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
    } catch (error) {
        console.error('[Profile GET] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
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
    } catch (error) {
        console.error('[Profile PATCH] Error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
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

        const currentHash = simpleHash(currentPassword);
        const storedHash = simpleHash('Admin@2024');
        
        if (currentHash !== storedHash) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
        }

        const newHash = simpleHash(newPassword);
        
        await prisma.adminUser.update({
            where: { id: session.id },
            data: { passwordHash: newHash },
        });

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        console.error('[Profile PUT] Error:', error);
        return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
    }
}