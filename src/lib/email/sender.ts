import { Resend } from 'resend';
import { logger } from "@/lib/reliability/logger";
import { sendSmtpEmail } from '@/lib/integrations/smtp';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
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
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}): Promise<EmailResult> {
  try {
    try {
      const id = await sendSmtpEmail({ to, subject, html, from });
      return { success: true, id };
    } catch (smtpError) {
      if (!process.env.RESEND_API_KEY) throw smtpError;
      logger.warn('[Email] SMTP unavailable; using Resend fallback', { error: smtpError instanceof Error ? smtpError.message : String(smtpError) });
    }
    const result = await resend.emails.send({
      from: from || 'Senza Luce Safaris <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    if (result.error) {
      logger.error('[Email] Send failed', { error: result.error instanceof Error ? result.error.message : String(result.error) });
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
    logger.error('[Email] Unexpected error', { error: error instanceof Error ? error.message : String(error) });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
