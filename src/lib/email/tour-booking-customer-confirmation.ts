import { sendEmail } from './sender';

interface TourBookingData {
  referenceNumber: string;
  tourName: string;
  travelDate: Date;
  endDate: Date;
  numberOfTravelers: number;
  accommodationLevel: string;
  customerName: string;
  customerEmail: string;
  createdAt: Date;
}

/**
 * Send customer confirmation email after tour booking submission
 */
export async function sendTourBookingCustomerConfirmation(booking: TourBookingData) {
  const companyEmail = process.env.COMPANY_EMAIL || 'info@senzalucesafaris.com';
  const companyPhone = process.env.COMPANY_PHONE || '+255 629 123 246';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://senzalucesafaris.com';

  // Extract first name from full name
  const firstName = booking.customerName.split(' ')[0] || 'there';

  const subject = `Safari Booking Received — Ref: ${booking.referenceNumber} — ${booking.tourName}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Safari Booking Confirmation</title>
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
                  <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Safari Booking Received</p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 24px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    Dear ${firstName},
                  </p>

                  <p style="margin: 0 0 24px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    Thank you for booking a safari with Senzaluce Safaris! We have received your booking request and our team is already preparing your personalized itinerary.
                  </p>

                  <!-- Reference Number -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff9e6; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 20px; margin-bottom: 24px;">
                    <tr>
                      <td>
                        <p style="margin: 0; color: #333333; font-size: 14px;">
                          <strong>Your Reference Number:</strong><br>
                          <span style="font-size: 24px; font-weight: bold; color: #1a5632; font-family: monospace;">${booking.referenceNumber}</span>
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Booking Summary -->
                  <h3 style="margin: 0 0 16px 0; color: #1a5632; font-size: 18px; font-weight: 600;">Booking Summary</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 6px; padding: 24px; margin-bottom: 24px;">
                    <tr>
                      <td>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px;">Tour</td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px; text-align: right; font-weight: 500;">${booking.tourName}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px;">Travel Date</td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px; text-align: right; font-weight: 500;">${new Date(booking.travelDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px;">End Date</td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px; text-align: right; font-weight: 500;">${new Date(booking.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px;">Travelers</td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px; text-align: right; font-weight: 500;">${booking.numberOfTravelers} ${booking.numberOfTravelers === 1 ? 'person' : 'people'}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px;">Accommodation</td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px; text-align: right; font-weight: 500;">${booking.accommodationLevel.charAt(0).toUpperCase() + booking.accommodationLevel.slice(1).replace('-', ' ')}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- What Happens Next -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e8f5e9; border-left: 4px solid #1a5632; border-radius: 4px; padding: 20px; margin-bottom: 24px;">
                    <tr>
                      <td>
                        <p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.6;">
                          <strong>What happens next?</strong><br>
                          Your dedicated safari expert will contact you within <strong>24 hours</strong> with your complete itinerary, accommodation confirmation, and secure payment instructions.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Contact Info -->
                  <p style="margin: 0 0 16px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    If you have any questions or need to make changes to your booking, please contact us:
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 8px 0;">
                        <a href="tel:${companyPhone}" style="color: #1a5632; text-decoration: none; font-size: 16px; font-weight: 500;">
                          Phone: ${companyPhone}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <a href="mailto:${companyEmail}" style="color: #1a5632; text-decoration: none; font-size: 16px; font-weight: 500;">
                          Email: ${companyEmail}
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 24px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    We look forward to creating an unforgettable safari experience for you in Tanzania!
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
    to: booking.customerEmail,
    subject,
    html,
  });
}
