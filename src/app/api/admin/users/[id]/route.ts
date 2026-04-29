import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, canAccess } from '@/lib/admin-auth';
import { z } from 'zod';
import { withApiResilience } from '@/lib/reliability/api-resilience';

const userUpdateSchema = z.object({
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    roleId: z.string().uuid().optional(),
    phone: z.string().max(20).optional(),
    avatar: z.string().url().optional(),
    jobTitle: z.string().max(100).optional(),
    isActive: z.boolean().optional(),
});

export const GET = withApiResilience(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canAccess(session, 50)) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;
    
    const user = await prisma.adminUser.findUnique({
        where: { id },
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
            isActive: user.isActive,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
        },
    });
}, { route: '/api/admin/users/:id', method: 'GET', requireAuth: true });

export const PATCH = withApiResilience(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canAccess(session, 50)) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validation = userUpdateSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(
            { error: 'Validation failed', details: validation.error.issues },
            { status: 400 }
        );
    }

    const data = validation.data;
    
    const existing = await prisma.adminUser.findUnique({ where: { id } });
    if (!existing) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (session.id === id && data.isActive === false) {
        return NextResponse.json({ error: 'Cannot deactivate yourself' }, { status: 400 });
    }

    if (data.roleId) {
        const role = await prisma.adminRole.findUnique({ where: { id: data.roleId } });
        if (!role) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }
    }

    const user = await prisma.adminUser.update({
        where: { id },
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            roleId: data.roleId,
            phone: data.phone,
            avatar: data.avatar,
            jobTitle: data.jobTitle,
            isActive: data.isActive,
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
            role: { id: user.role.id, name: user.role.name, displayName: user.role.displayName },
            isActive: user.isActive,
        },
    });
}, { route: '/api/admin/users/:id', method: 'PATCH', requireAuth: true });

export const DELETE = withApiResilience(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canAccess(session, 100)) {
        return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
    }

    const { id } = await params;
    
    if (session.id === id) {
        return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({ where: { id } });
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.adminUser.delete({ where: { id } });

    return NextResponse.json({ success: true });
}, { route: '/api/admin/users/:id', method: 'DELETE', requireAuth: true });