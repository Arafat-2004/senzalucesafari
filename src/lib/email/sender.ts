import { Resend } from 'resend';

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
    const result = await resend.emails.send({
      from: from || 'Senza Luce Safaris <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    if (result.error) {
      console.error('[Email] Send failed:', result.error);
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
    console.error('[Email] Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
