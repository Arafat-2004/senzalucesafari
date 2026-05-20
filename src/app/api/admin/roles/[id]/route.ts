import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, canAccess } from '@/lib/admin-auth';
import { z } from 'zod';
import { logger } from '@/lib/reliability/logger';

const roleUpdateSchema = z.object({
    displayName: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    permissions: z.any().optional(),
    level: z.number().min(0).max(100).optional(),
    isDefault: z.boolean().optional(),
});

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!canAccess(session, 50)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const { id } = await params;
        
        const role = await prisma.adminRole.findUnique({
            where: { id },
            include: { _count: { select: { users: true } } },
        });

        if (!role) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }

        return NextResponse.json({ role });
    } catch (error) {
        logger.error('[Role GET] Error', { error: error instanceof Error ? error.message : String(error) });
        return NextResponse.json({ error: 'Failed to fetch role' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!canAccess(session, 100)) {
            return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const validation = roleUpdateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.issues },
                { status: 400 }
            );
        }

        const data = validation.data;
        
        const existing = await prisma.adminRole.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }

        // Prevent changing super_admin level
        if (existing.name === 'super_admin' && data.level && data.level !== 100) {
            return NextResponse.json({ error: 'Cannot change super_admin level' }, { status: 400 });
        }

        const role = await prisma.adminRole.update({
            where: { id },
            data: {
                displayName: data.displayName,
                description: data.description,
                permissions: data.permissions,
                level: data.level,
                isDefault: data.isDefault,
            },
        });

        return NextResponse.json({
            success: true,
            role,
        });
    } catch (error) {
        logger.error('[Role PATCH] Error', { error: error instanceof Error ? error.message : String(error) });
        return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!canAccess(session, 100)) {
            return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
        }

        const { id } = await params;
        
        const role = await prisma.adminRole.findUnique({ 
            where: { id },
            include: { _count: { select: { users: true } } },
        });
        
        if (!role) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }

        // Prevent deleting roles with users
        if (role._count.users > 0) {
            return NextResponse.json({ 
                error: `Cannot delete role with ${role._count.users} users. Reassign users first.` 
            }, { status: 400 });
        }

        // Prevent deleting super_admin
        if (role.name === 'super_admin') {
            return NextResponse.json({ error: 'Cannot delete super_admin role' }, { status: 400 });
        }

        await prisma.adminRole.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        logger.error('[Role DELETE] Error', { error: error instanceof Error ? error.message : String(error) });
        return NextResponse.json({ error: 'Failed to delete role' }, { status: 500 });
    }
}