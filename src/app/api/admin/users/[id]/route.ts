import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, sessionHasPermission } from '@/lib/admin-auth';
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

export const GET = withApiResilience(async (request: Request, ctx: Record<string, unknown>) => {
    const params = ctx.params as Promise<{ id: string }>
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!sessionHasPermission(session, 'users', 'VIEW')) {
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

export const PATCH = withApiResilience(async (request: Request, ctx: Record<string, unknown>) => {
    const params = ctx.params as Promise<{ id: string }>
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!sessionHasPermission(session, 'users', 'EDIT')) {
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
    
    const existing = await prisma.adminUser.findUnique({ where: { id }, include: { role: true } });
    if (!existing) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (session.role.name !== 'super_admin' && existing.role.level >= session.role.level) {
        return NextResponse.json({ error: 'You cannot modify an administrator at your role level or above' }, { status: 403 });
    }

    if (session.id === id && data.isActive === false) {
        return NextResponse.json({ error: 'Cannot deactivate yourself' }, { status: 400 });
    }

    if (data.roleId) {
        const role = await prisma.adminRole.findUnique({ where: { id: data.roleId } });
        if (!role) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }
        if (session.role.name !== 'super_admin' && role.level >= session.role.level) {
            return NextResponse.json({ error: 'You cannot assign a role at your level or above' }, { status: 403 });
        }
    }

    // Safety check: prevent deactivating or demoting the last active super_admin
    const superAdminRole = await prisma.adminRole.findUnique({ where: { name: 'super_admin' } });
    if (superAdminRole && existing.roleId === superAdminRole.id) {
        const isDeactivating = data.isActive === false;
        const isChangingRole = data.roleId && data.roleId !== superAdminRole.id;
        if (isDeactivating || isChangingRole) {
            const superAdminCount = await prisma.adminUser.count({
                where: { roleId: superAdminRole.id, isActive: true }
            });
            if (superAdminCount <= 1) {
                return NextResponse.json({ error: 'Cannot deactivate or demote the last active super administrator in the system' }, { status: 400 });
            }
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
    await prisma.adminAuditLog.create({ data: { userId: session.id, action: 'UPDATE', entityType: 'admin_user', entityId: id, description: `Updated administrator ${existing.email}`, metadata: { changedFields: Object.keys(data) } } });

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

export const DELETE = withApiResilience(async (request: Request, ctx: Record<string, unknown>) => {
    const params = ctx.params as Promise<{ id: string }>
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!sessionHasPermission(session, 'users', 'DELETE')) {
        return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
    }

    const { id } = await params;
    
    if (session.id === id) {
        return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({ where: { id }, include: { role: true } });
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (session.role.name !== 'super_admin' && user.role.level >= session.role.level) {
        return NextResponse.json({ error: 'You cannot delete an administrator at your role level or above' }, { status: 403 });
    }

    // Safety check: prevent deleting the last active super_admin
    const superAdminRole = await prisma.adminRole.findUnique({ where: { name: 'super_admin' } });
    if (superAdminRole && user.roleId === superAdminRole.id) {
        const superAdminCount = await prisma.adminUser.count({
            where: { roleId: superAdminRole.id, isActive: true }
        });
        if (superAdminCount <= 1) {
            return NextResponse.json({ error: 'Cannot delete the last active super administrator in the system' }, { status: 400 });
        }
    }

    await prisma.adminAuditLog.create({ data: { userId: session.id, action: 'DELETE', entityType: 'admin_user', entityId: id, description: `Deleted administrator ${user.email}` } });
    await prisma.adminUser.delete({ where: { id } });

    return NextResponse.json({ success: true });
}, { route: '/api/admin/users/:id', method: 'DELETE', requireAuth: true });
