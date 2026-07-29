import { NextResponse } from 'next/server';
import { login } from '@/lib/admin-auth';
import { getClientIp } from '@/lib/security';
import { withApiResilience } from '@/lib/reliability/api-resilience';
import { logger } from '@/lib/reliability/logger';

export const POST = withApiResilience(async (request: Request) => {
    let body: { email?: string; password?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid login request.' }, { status: 400 });
    }
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SIGNING_SECRET && !process.env.NEXTAUTH_SECRET) {
        logger.error('[Login] Session signing secret is not configured');
        return NextResponse.json(
            { error: 'Admin sign-in is temporarily unavailable. Please contact support.' },
            { status: 503 },
        );
    }

    // Playwright uses a test-only identity so the protected workflows can be
    // exercised without depending on a seeded production admin account.
    if (process.env.NODE_ENV !== 'production' && process.env.E2E_BYPASS_ADMIN_AUTH === '1') {
        return NextResponse.json({
            success: true,
            user: { id: 'e2e-admin', email, firstName: 'E2E', lastName: 'Admin', role: 'super_admin' },
        });
    }

    const clientIp = getClientIp(request);
    logger.info('[Login] Attempting login for', { email });

    const result = await login(email, password, clientIp);
    logger.info('[Login] Login result', { success: result.success });

    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 401 });
    }

    // Look up AdminUser by email to get their Prisma ID
    const { prisma } = await import('@/lib/prisma');
    logger.info('[Login] Fetching user from DB...');
    const adminUser = await prisma.adminUser.findUnique({
        where: { email: email.toLowerCase() },
        include: { role: true },
    });
    logger.info('[Login] User fetched', { adminUserId: adminUser?.id });

    if (!adminUser || !adminUser.isActive) {
        return NextResponse.json({ error: 'Account not found or disabled' }, { status: 403 });
    }

    // Create response first, then set cookies directly on it
    const response = NextResponse.json({
        success: true,
        user: {
            id: adminUser.id,
            email: adminUser.email,
            firstName: adminUser.firstName,
            lastName: adminUser.lastName,
            role: adminUser.role.name,
        },
    });

    // Use the response-based cookie setter for reliable delivery in Route Handlers
    const { setSessionOnResponse } = await import('@/lib/admin-auth');
    logger.info('[Login] Setting session cookies...');
    await setSessionOnResponse(response, adminUser.id);
    logger.info('[Login] Login successful');

    return response;
}, { route: '/api/admin/login', method: 'POST' });
