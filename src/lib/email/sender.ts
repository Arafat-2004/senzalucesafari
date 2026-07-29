import { Resend } from 'resend';
import { logger } from "@/lib/reliability/logger";
import { sendSmtpEmail } from '@/lib/integrations/smtp';

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

export type EmailCategory = 'auth' | 'bookings' | 'contact' | 'support' | 'general';

export const EMAIL_CATEGORIES = {
  auth: {
    email: () => process.env.EMAIL_FROM || 'info@senzalucesafari.com',
    name: () => process.env.EMAIL_FROM_NAME || 'Senza Luce Safari',
  },
  bookings: {
    email: () => process.env.EMAIL_BOOKINGS || 'bookings@senzalucesafari.com',
    name: () => process.env.EMAIL_BOOKINGS_NAME || 'Senza Luce Safari Bookings',
  },
  contact: {
    email: () => process.env.EMAIL_CONTACT || 'contact@senzalucesafari.com',
    name: () => process.env.EMAIL_CONTACT_NAME || 'Senza Luce Safari Contact',
  },
  support: {
    email: () => process.env.EMAIL_SUPPORT || 'support@senzalucesafari.com',
    name: () => process.env.EMAIL_SUPPORT_NAME || 'Senza Luce Safari Support',
  },
  general: {
    email: () => process.env.EMAIL_GENERAL || 'hello@senzalucesafari.com',
    name: () => process.env.EMAIL_GENERAL_NAME || 'Senza Luce Safari',
  },
} as const;

/**
 * Resolves the default name & email sender string for a given category.
 */
export function getSenderString(category: EmailCategory): string {
  const cat = EMAIL_CATEGORIES[category];
  return `${cat.name()} <${cat.email()}>`;
}

/**
 * Send email using Resend
 * Wraps Resend's emails.send() in try/catch
 * NEVER throws - always returns result object
 */
export async function sendEmail({
  to,
  subject,
  html,
  from,
  category,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
  category?: EmailCategory;
}): Promise<EmailResult> {
  try {
    // Resolve from and replyTo dynamically based on category
    let sender = from;
    let replyToEmail = process.env.EMAIL_REPLY_TO;

    if (!sender) {
      if (category) {
        sender = getSenderString(category);
        replyToEmail = EMAIL_CATEGORIES[category].email();
      } else {
        sender = process.env.EMAIL_FROM_NAME
          ? `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM || 'info@senzalucesafari.com'}>`
          : 'Senza Luce Safari <info@senzalucesafari.com>';
      }
    }

    // Attempt SMTP delivery first
    try {
      const id = await sendSmtpEmail({ to, subject, html, from: sender, replyTo: replyToEmail || undefined });
      return { success: true, id };
    } catch (smtpError) {
      if (!process.env.RESEND_API_KEY) throw smtpError;
      logger.warn('[Email] SMTP unavailable; using Resend fallback', { 
        error: smtpError instanceof Error ? smtpError.message : String(smtpError) 
      });
    }

    // Fall back to Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return { success: false, error: 'No email delivery provider is configured' };
    }

    const resend = new Resend(resendApiKey);
    const result = await resend.emails.send({
      from: sender,
      to,
      subject,
      html,
      replyTo: replyToEmail || undefined,
    });

    if (result.error) {
      logger.error('[Email] Send failed', { 
        error: result.error instanceof Error ? result.error.message : String(result.error) 
      });
      return {
        success: false,
        error: result.error.message,
      };
    }

    return {
      success: true,
      id: result.data?.id,
    };
  } catch (error) {
    logger.error('[Email] Unexpected error', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
