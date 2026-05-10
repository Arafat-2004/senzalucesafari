import { prisma } from '@/lib/prisma';

export interface SubscribeResult {
    success: boolean;
    message: string;
    alreadySubscribed?: boolean;
}

/** Subscribe an email to the newsletter */
export async function subscribeNewsletter(email: string): Promise<SubscribeResult> {
    try {
      const existing = await prisma.newsletter.findUnique({ where: { email } });

      if (existing) {
          if (existing.isActive) {
              return { success: true, message: 'Already subscribed', alreadySubscribed: true };
          }
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
    } catch {
      return { success: false, message: 'Subscription service unavailable. Please try again later.' };
    }
}

/** Unsubscribe an email from the newsletter */
export async function unsubscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const existing = await prisma.newsletter.findUnique({ where: { email } });

      if (!existing || !existing.isActive) {
          return { success: false, message: 'Email not found in subscription list' };
      }

      await prisma.newsletter.update({
          where: { email },
          data: { isActive: false, unsubscribedAt: new Date() },
      });

      return { success: true, message: 'Successfully unsubscribed from newsletter' };
    } catch {
      return { success: false, message: 'Unsubscription service unavailable. Please try again later.' };
    }
}
