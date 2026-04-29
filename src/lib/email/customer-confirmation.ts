import { sendEmail } from './sender';

interface InquiryData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  inquiryType: string;
  tourInterest: string | null;
  travelDate: Date | null;
  numberOfTravelers: number | null;
  createdAt: Date;
}

/**
 * Send customer confirmation email after inquiry submission
 */
export async function sendCustomerConfirmationEmail(inquiry: InquiryData) {
  const companyEmail = process.env.COMPANY_EMAIL || 'info@senzalucesafaris.com';
  const companyPhone = process.env.COMPANY_PHONE || '+255 629 123 246';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://senzalucesafaris.com';

  // Extract first name from full name
  const firstName = inquiry.name.split(' ')[0] || 'there';

  const subject = `We received your inquiry — Senzaluce Safaris`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Inquiry Confirmation</title>
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
                  <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Explore Tanzania Like Never Before</p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 24px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    Dear ${firstName},
                  </p>

                  <p style="margin: 0 0 24px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    Thank you for reaching out to Senzaluce Safaris! We have received your inquiry and our team will review it carefully.
                  </p>

                  <!-- Inquiry Summary -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 6px; padding: 24px; margin-bottom: 24px;">
                    <tr>
                      <td>
                        <h3 style="margin: 0 0 16px 0; color: #1a5632; font-size: 18px; font-weight: 600;">Your Inquiry Summary</h3>
                        
                        <table width="100%" cellpadding="0" cellspacing="0">
                          ${inquiry.tourInterest ? `
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px;">Tour of Interest</td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px; text-align: right; font-weight: 500;">${inquiry.tourInterest}</td>
                          </tr>
                          ` : ''}
                          ${inquiry.travelDate ? `
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px;">Preferred Date</td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px; text-align: right; font-weight: 500;">${new Date(inquiry.travelDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                          </tr>
                          ` : ''}
                          ${inquiry.numberOfTravelers ? `
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px;">Travelers</td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px; text-align: right; font-weight: 500;">${inquiry.numberOfTravelers} ${inquiry.numberOfTravelers === 1 ? 'person' : 'people'}</td>
                          </tr>
                          ` : ''}
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px;">Reference ID</td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px; text-align: right; font-weight: 500;">${inquiry.id}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Response Time -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff9e6; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 20px; margin-bottom: 24px;">
                    <tr>
                      <td>
                        <p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.6;">
                          <strong>What happens next?</strong><br>
                          Our safari experts will review your inquiry and get back to you within <strong>24-48 hours</strong> with a personalized response and detailed itinerary.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Contact Info -->
                  <p style="margin: 0 0 16px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    For urgent inquiries, feel free to contact us directly:
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 8px 0;">
                        <a href="tel:${companyPhone}" style="color: #1a5632; text-decoration: none; font-size: 16px; font-weight: 500;">
                          📞 ${companyPhone}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <a href="mailto:${companyEmail}" style="color: #1a5632; text-decoration: none; font-size: 16px; font-weight: 500;">
                          ✉️ ${companyEmail}
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 24px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    We look forward to helping you plan your unforgettable Tanzania safari adventure!
                  </p>

                  <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    Warm regards,<br>
                    <strong style="color: #1a5632;">The Senzaluce Safaris Team</strong>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f5f5f5; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
                  <p style="margin: 0 0 8px 0; color: #666666; font-size: 14px; font-weight: 500;">
                    Senzaluce Safaris
                  </p>
                  <p style="margin: 0; color: #666666; font-size: 12px; line-height: 1.6;">
                    Arusha, Tanzania<br>
                    ${companyPhone} | ${companyEmail}<br>
                    <a href="${siteUrl}" style="color: #1a5632; text-decoration: none;">www.senzalucesafaris.com</a>
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
    to: inquiry.email,
    subject,
    html,
  });
}
