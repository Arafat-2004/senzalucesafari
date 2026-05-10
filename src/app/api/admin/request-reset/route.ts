import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiResilience } from '@/lib/reliability/api-resilience';

export const POST = withApiResilience(async (request: Request) => {
    const { email } = await request.json();

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const adminUser = await prisma.adminUser.findUnique({
        where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!adminUser) {
        return NextResponse.json({ success: true });
    }

    // Generate a secure random token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
        data: {
            adminUserId: adminUser.id,
            token,
            expiresAt,
        },
    });

    // Send email if SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        try {
            const nodemailer = await import('nodemailer');
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/reset-password?token=${token}`;

            await transporter.sendMail({
                from: process.env.SMTP_FROM || 'noreply@senzaluce.com',
                to: adminUser.email,
                subject: 'Reset Your Admin Password',
                html: `
                    <p>Hello ${adminUser.firstName},</p>
                    <p>Click the link below to reset your admin password:</p>
                    <p><a href="${resetUrl}">Reset Password</a></p>
                    <p>This link expires in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                `,
            });
        } catch (error) {
            console.error('Failed to send password reset email:', error);
        }
    } else {
        // In development, log the reset URL
        if (process.env.NODE_ENV !== 'production') {
            const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/reset-password?token=${token}`;
            console.log('[DEV] Password reset URL:', resetUrl);
        }
    }

    return NextResponse.json({ success: true });
}, { route: '/api/admin/request-reset', method: 'POST', throttleMs: 30000 });
