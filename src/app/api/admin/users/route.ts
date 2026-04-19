import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, canAccess } from '@/lib/admin-auth';
import { z } from 'zod';

const userCreateSchema = z.object({
    email: z.string().email('Invalid email').toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    roleId: z.string().uuid('Invalid role'),
    phone: z.string().max(20).optional(),
    avatar: z.string().url().optional(),
    jobTitle: z.string().max(100).optional(),
    isActive: z.boolean().default(true),
});

const userUpdateSchema = z.object({
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    roleId: z.string().uuid().optional(),
    phone: z.string().max(20).optional(),
    avatar: z.string().url().optional(),
    jobTitle: z.string().max(100).optional(),
    isActive: z.boolean().optional(),
});

function simpleHash(str: string): string {
    const crypto = require('crypto');
    const SALT = process.env.AUTH_SALT || 'default-salt-change-in-production';
    return crypto.createHmac('sha256', SALT).update(str).digest('hex');
}

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!canAccess(session, 50)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';
        const roleId = searchParams.get('roleId');
        const isActive = searchParams.get('isActive');

        const where: any = {};
        
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (roleId) where.roleId = roleId;
        if (isActive !== null) where.isActive = isActive === 'true';

        const [users, total, roles] = await Promise.all([
            prisma.adminUser.findMany({
                where,
                include: { role: { select: { id: true, name: true, displayName: true, level: true } } },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.adminUser.count({ where }),
            prisma.adminRole.findMany({ orderBy: { level: 'desc' } }),
        ]);

        const maskedUsers = users.map(u => ({
            id: u.id,
            email: u.email,
            firstName: u.firstName,
            lastName: u.lastName,
            avatar: u.avatar,
            phone: u.phone,
            jobTitle: u.jobTitle,
            role: u.role,
            isActive: u.isActive,
            lastLoginAt: u.lastLoginAt,
            createdAt: u.createdAt,
        }));

        return NextResponse.json({
            users: maskedUsers,
            roles,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error('[Users GET] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
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
        const validation = userCreateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.issues },
                { status: 400 }
            );
        }

        const data = validation.data;

        // Check if email exists
        const existing = await prisma.adminUser.findUnique({
            where: { email: data.email },
        });

        if (existing) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
        }

        // Verify role exists
        const role = await prisma.adminRole.findUnique({
            where: { id: data.roleId },
        });

        if (!role) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }

        // Create user with hashed password
        const passwordHash = simpleHash(data.password);
        
        const user = await prisma.adminUser.create({
            data: {
                email: data.email,
                passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
                roleId: data.roleId,
                phone: data.phone || null,
                avatar: data.avatar || null,
                jobTitle: data.jobTitle || null,
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
        }, { status: 201 });
    } catch (error) {
        console.error('[Users POST] Error:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}