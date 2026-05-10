import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiResilience } from '@/lib/reliability/api-resilience';
import { hashPassword } from '@/lib/security';

export const POST = withApiResilience(async (request: Request) => {
    const { token, password } = await request.json();

    if (!token || !password) {
        return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
        include: { adminUser: true },
    });

    if (!resetToken) {
        return NextResponse.json({ error: 'Invalid reset token' }, { status: 400 });
    }

    if (resetToken.expiresAt < new Date()) {
        await prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: { used: true },
        });
        return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 });
    }

    if (resetToken.used) {
        return NextResponse.json({ error: 'Reset token has already been used' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    await prisma.$transaction([
        prisma.adminUser.update({
            where: { id: resetToken.adminUserId },
            data: {
                passwordHash,
                failedAttempts: 0,
                lockedUntil: null,
            },
        }),
        prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: { used: true },
        }),
    ]);

    return NextResponse.json({ success: true });
}, { route: '/api/admin/reset-password', method: 'POST', throttleMs: 2000 });
