import { sendEmail } from './sender';

interface TourBookingData {
  id: string;
  referenceNumber: string;
  tourName: string;
  tourSlug: string;
  travelDate: Date;
  endDate: Date;
  numberOfTravelers: number;
  accommodationLevel: string;
  specialRequests: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  totalPrice: number;
  currency: string;
  createdAt: Date;
}

/**
 * Send admin notification email when a new tour booking is made
 */
export async function sendTourBookingAdminNotification(booking: TourBookingData) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://senzalucesafaris.com';

  if (!adminEmail) {
    console.error('[Email] ADMIN_EMAIL not configured');
    return { success: false, error: 'ADMIN_EMAIL not configured' };
  }

  const subject = `New Safari Booking — ${booking.firstName} ${booking.lastName} — ${booking.tourName} — ${booking.travelDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Safari Booking</title>
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
                  <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">New Safari Booking Request</p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <!-- Reference Number -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff9e6; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 20px; margin-bottom: 24px;">
                    <tr>
                      <td>
                        <p style="margin: 0; color: #333333; font-size: 14px;">
                          <strong>Reference Number:</strong><br>
                          <span style="font-size: 24px; font-weight: bold; color: #1a5632; font-family: monospace;">${booking.referenceNumber}</span>
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 24px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    A new safari booking request has been submitted. Here are the details:
                  </p>

                  <!-- Booking Details -->
                  <h3 style="margin: 0 0 16px 0; color: #1a5632; font-size: 18px; font-weight: 600;">Booking Details</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                        <strong style="color: #666666; font-size: 14px;">Tour Package</strong><br>
                        <span style="color: #333333; font-size: 16px;">${booking.tourName}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                        <strong style="color: #666666; font-size: 14px;">Travel Dates</strong><br>
                        <span style="color: #333333; font-size: 16px;">${booking.travelDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} - ${booking.endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                        <strong style="color: #666666; font-size: 14px;">Number of Travelers</strong><br>
                        <span style="color: #333333; font-size: 16px;">${booking.numberOfTravelers}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                        <strong style="color: #666666; font-size: 14px;">Accommodation Level</strong><br>
                        <span style="color: #333333; font-size: 16px;">${booking.accommodationLevel}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                        <strong style="color: #666666; font-size: 14px;">Total Price</strong><br>
                        <span style="color: #333333; font-size: 16px;">${booking.currency} ${booking.totalPrice.toFixed(2)}</span>
                      </td>
                    </tr>
                    ${booking.specialRequests ? `
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                        <strong style="color: #666666; font-size: 14px;">Special Requests</strong><br>
                        <span style="color: #333333; font-size: 16px;">${booking.specialRequests}</span>
                      </td>
                    </tr>
                    ` : ''}
                  </table>

                  <!-- Customer Info -->
                  <h3 style="margin: 0 0 16px 0; color: #1a5632; font-size: 18px; font-weight: 600;">Customer Details</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                        <strong style="color: #666666; font-size: 14px;">Customer Name</strong><br>
                        <span style="color: #333333; font-size: 16px;">${booking.firstName} ${booking.lastName}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                        <strong style="color: #666666; font-size: 14px;">Email</strong><br>
                        <a href="mailto:${booking.email}" style="color: #1a5632; font-size: 16px; text-decoration: none;">${booking.email}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                        <strong style="color: #666666; font-size: 14px;">Phone</strong><br>
                        <span style="color: #333333; font-size: 16px;">${booking.phone}</span>
                      </td>
                    </tr>
                    ${booking.country ? `
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                        <strong style="color: #666666; font-size: 14px;">Country</strong><br>
                        <span style="color: #333333; font-size: 16px;">${booking.country}</span>
                      </td>
                    </tr>
                    ` : ''}
                  </table>

                  <!-- Submission Info -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
                    <tr>
                      <td>
                        <p style="margin: 0; color: #666666; font-size: 14px;">
                          <strong>Submitted:</strong> ${booking.createdAt.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}<br>
                          <strong>Booking ID:</strong> ${booking.id}
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 24px 0;">
                        <a href="${siteUrl}/admin/bookings" style="display: inline-block; background-color: #1a5632; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;">View in Admin Dashboard</a>
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
