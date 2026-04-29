import { NextResponse } from 'next/server';
import { setSession, getSession } from '@/lib/admin-auth';
import { validateCsrfToken } from '@/lib/security';
import { prisma } from '@/lib/prisma';
import { withApiResilience } from '@/lib/reliability/api-resilience';

export const POST = withApiResilience(async (request: Request) => {
    const body = await request.json();
    const { userId } = body;
    const csrfToken = request.headers.get('X-CSRF-Token');

    if (csrfToken) {
        const validCsrf = await validateCsrfToken(csrfToken);
        if (!validCsrf) {
            return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
        }
    }

    let adminUser = null;
    
    if (userId) {
        adminUser = await prisma.adminUser.findUnique({
            where: { id: userId },
            include: { role: true }
        });
    }
    
    if (!adminUser && body.email) {
        adminUser = await prisma.adminUser.findUnique({
            where: { email: body.email },
            include: { role: true }
        });
    }

    if (!adminUser) {
        return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    if (!adminUser.isActive) {
        return NextResponse.json({ error: 'Account is disabled' }, { status: 403 });
    }

    await setSession(adminUser.id);

    return NextResponse.json({ 
        success: true, 
        message: 'Session created',
        user: {
            id: adminUser.id,
            email: adminUser.email,
            firstName: adminUser.firstName,
            lastName: adminUser.lastName,
        }
    });
}, { route: '/api/admin/session', method: 'POST', throttleMs: 500 });

export const GET = withApiResilience(async () => {
    const session = await getSession();
    
    if (!session) {
        return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
        authenticated: true,
        user: {
            id: session.id,
            email: session.email,
            firstName: session.firstName,
            lastName: session.lastName,
            role: session.role.name,
        },
    });
}, { route: '/api/admin/session', method: 'GET' });