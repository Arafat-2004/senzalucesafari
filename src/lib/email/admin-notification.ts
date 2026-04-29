import { sendEmail } from './sender';

interface InquiryData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  subject: string;
  message: string;
  inquiryType: string;
  tourInterest: string | null;
  travelDate: Date | null;
  numberOfTravelers: number | null;
  createdAt: Date;
}

/**
 * Send admin notification email when a new inquiry is submitted
 */
export async function sendAdminNotificationEmail(inquiry: InquiryData) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://senzalucesafaris.com';

  if (!adminEmail) {
    console.error('[Email] ADMIN_EMAIL not configured');
    return { success: false, error: 'ADMIN_EMAIL not configured' };
  }

  const subject = `New Safari Inquiry — ${inquiry.name}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Safari Inquiry</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color: #1a5632; padding: 30px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Senza Luce Safaris</h1>
                  <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">New Inquiry Received</p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 24px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    A new inquiry has been submitted through the website. Here are the details:
                  </p>

                  <!-- Customer Info Table -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                        <strong style="color: #666666; font-size: 14px;">Customer Name</strong><br>
                        <span style="color: #333333; font-size: 16px;">${inquiry.name}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                        <strong style="color: #666666; font-size: 14px;">Email</strong><br>
                        <a href="mailto:${inquiry.email}" style="color: #1a5632; font-size: 16px; text-decoration: none;">${inquiry.email}</a>
                      </td>
                    </tr>
                    ${inquiry.phone ? `
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                        <strong style="color: #666666; font-size: 14px;">Phone</strong><br>
                        <span style="color: #333333; font-size: 16px;">${inquiry.phone}</span>
                      </td>
                    </tr>
                    ` : ''}
                    ${inquiry.country ? `
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                        <strong style="color: #666666; font-size: 14px;">Country</strong><br>
                        <span style="color: #333333; font-size: 16px;">${inquiry.country}</span>
                      </td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                        <strong style="color: #666666; font-size: 14px;">Inquiry Type</strong><br>
                        <span style="color: #333333; font-size: 16px;">${inquiry.inquiryType.replace(/_/g, ' ')}</span>
                      </td>
                    </tr>
                    ${inquiry.tourInterest ? `
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                        <strong style="color: #666666; font-size: 14px;">Tour of Interest</strong><br>
                        <span style="color: #333333; font-size: 16px;">${inquiry.tourInterest}</span>
                      </td>
                    </tr>
                    ` : ''}
                    ${inquiry.travelDate ? `
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                        <strong style="color: #666666; font-size: 14px;">Preferred Travel Date</strong><br>
                        <span style="color: #333333; font-size: 16px;">${new Date(inquiry.travelDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </td>
                    </tr>
                    ` : ''}
                    ${inquiry.numberOfTravelers ? `
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                        <strong style="color: #666666; font-size: 14px;">Number of Travelers</strong><br>
                        <span style="color: #333333; font-size: 16px;">${inquiry.numberOfTravelers}</span>
                      </td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                        <strong style="color: #666666; font-size: 14px;">Subject</strong><br>
                        <span style="color: #333333; font-size: 16px;">${inquiry.subject}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0;">
                        <strong style="color: #666666; font-size: 14px;">Message</strong><br>
                        <p style="margin: 8px 0 0 0; color: #333333; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${inquiry.message}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Submission Info -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
                    <tr>
                      <td>
                        <p style="margin: 0; color: #666666; font-size: 14px;">
                          <strong>Submitted:</strong> ${inquiry.createdAt.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}<br>
                          <strong>Inquiry ID:</strong> ${inquiry.id}
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 24px 0;">
                        <a href="${siteUrl}/admin/inquiries" style="display: inline-block; background-color: #1a5632; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;">View in Admin Dashboard</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f5f5f5; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
                  <p style="margin: 0; color: #666666; font-size: 12px; line-height: 1.6;">
                    This is an automated notification from Senza Luce Safaris<br>
                    Arusha, Tanzania | ${process.env.COMPANY_PHONE || '+255 629 123 246'}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject,
    html,
  });
}
