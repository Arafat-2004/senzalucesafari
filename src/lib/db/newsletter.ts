import { prisma } from '@/lib/prisma';

export interface SubscribeResult {
    success: boolean;
    message: string;
    alreadySubscribed?: boolean;
}

/** Subscribe an email to the newsletter */
export async function subscribeNewsletter(email: string): Promise<SubscribeResult> {
    const existing = await prisma.newsletter.findUnique({ where: { email } });

    if (existing) {
        if (existing.isActive) {
            return { success: true, message: 'Already subscribed', alreadySubscribed: true };
        }
        // Re-subscribe
        await prisma.newsletter.update({
            where: { email },
            data: { isActive: true, unsubscribedAt: null },
        });
        return { success: true, message: 'Successfully re-subscribed to newsletter' };
    }

    await prisma.newsletter.create({
        data: { email },
    });

    return { success: true, message: 'Successfully subscribed to newsletter' };
}

/** Unsubscribe an email from the newsletter */
export async function unsubscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    const existing = await prisma.newsletter.findUnique({ where: { email } });

    if (!existing || !existing.isActive) {
        return { success: false, message: 'Email not found in subscription list' };
    }

    await prisma.newsletter.update({
        where: { email },
        data: { isActive: false, unsubscribedAt: new Date() },
    });

    return { success: true, message: 'Successfully unsubscribed from newsletter' };
}
