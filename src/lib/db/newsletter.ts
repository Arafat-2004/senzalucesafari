import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/reliability/logger';

export interface SubscribeResult {
    success: boolean;
    message: string;
    alreadySubscribed?: boolean;
}

/** Subscribe an email to the newsletter */
export async function subscribeNewsletter(email: string): Promise<SubscribeResult> {
    try {
      const existing = await prisma.newsletter.findUnique({ where: { email } });

      if (existing && existing.isActive) {
          return { success: true, message: 'Already subscribed', alreadySubscribed: true };
      }

      await prisma.newsletter.upsert({
          where: { email },
          update: { isActive: true, unsubscribedAt: null },
          create: { email, isActive: true },
      });

      return {
          success: true,
          message: existing ? 'Successfully re-subscribed to newsletter' : 'Successfully subscribed to newsletter'
      };
    } catch (err: unknown) {
      logger.error('[Newsletter DB] Subscription failed', { email, error: err instanceof Error ? err.message : String(err) });
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
    } catch (err: unknown) {
      logger.error('[Newsletter DB] Unsubscription failed', { email, error: err instanceof Error ? err.message : String(err) });
      return { success: false, message: 'Unsubscription service unavailable. Please try again later.' };
    }
}
