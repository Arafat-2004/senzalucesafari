import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, canAccess } from '@/lib/admin-auth';
import { z } from 'zod';

const roleSchema = z.object({
    name: z.string().min(1).max(50),
    displayName: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    permissions: z.any().optional(),
    level: z.number().min(0).max(100),
    isDefault: z.boolean().default(false),
});

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!canAccess(session, 50)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const roles = await prisma.adminRole.findMany({
            orderBy: { level: 'desc' },
            include: {
                _count: { select: { users: true } },
            },
        });

        return NextResponse.json({ roles });
    } catch (error) {
        console.error('[Roles GET] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!canAccess(session, 100)) {
            return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const validation = roleSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.issues },
                { status: 400 }
            );
        }

        const data = validation.data;

        // Check name uniqueness
        const existing = await prisma.adminRole.findUnique({
            where: { name: data.name.toLowerCase() },
        });

        if (existing) {
            return NextResponse.json({ error: 'Role name already exists' }, { status: 409 });
        }

        const role = await prisma.adminRole.create({
            data: {
                name: data.name.toLowerCase(),
                displayName: data.displayName,
                description: data.description || null,
                permissions: data.permissions || {},
                level: data.level,
                isDefault: data.isDefault,
            },
        });

        return NextResponse.json({
            success: true,
            role,
        }, { status: 201 });
    } catch (error) {
        console.error('[Roles POST] Error:', error);
        return NextResponse.json({ error: 'Failed to create role' }, { status: 500 });
    }
}