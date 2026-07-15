import { NextResponse } from 'next/server';
import { setSessionOnResponse, getSession } from '@/lib/admin-auth';
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
    let dbError = false;
    
    if (userId) {
        try {
            adminUser = await prisma.adminUser.findUnique({
                where: { id: userId },
                include: { role: true }
            });
        } catch {
            dbError = true;
        }
    }
    
    if (!adminUser && !dbError && body.email) {
        try {
            adminUser = await prisma.adminUser.findUnique({
                where: { email: body.email },
                include: { role: true }
            });
        } catch {
            dbError = true;
        }
    }

    if (dbError) {
        return NextResponse.json({
            error: 'Database unavailable. The login service cannot create your session right now. The database may be paused after inactivity.',
            success: false,
        }, { status: 503 });
    }

    if (!adminUser) {
        return NextResponse.json({
            error: 'Admin user not found. Your Supabase identity is valid, but no matching admin record exists in the application database. An administrator must provision your account.',
            success: false,
        }, { status: 404 });
    }

    if (!adminUser.isActive) {
        return NextResponse.json({ error: 'Account is disabled', success: false }, { status: 403 });
    }

    // Create response first, then set cookies directly on it
    // This is more reliable than using cookies() from next/headers in Route Handlers
    const response = NextResponse.json({ 
        success: true, 
        message: 'Session created',
        user: {
            id: adminUser.id,
            email: adminUser.email,
            firstName: adminUser.firstName,
            lastName: adminUser.lastName,
        }
    });

    await setSessionOnResponse(response, adminUser.id);

    return response;
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