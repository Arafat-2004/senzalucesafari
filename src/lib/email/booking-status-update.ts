import { sendEmail } from './sender';

interface BookingStatusUpdateData {
  bookingRef: string;
  tourName: string;
  customerFirstName: string;
  customerEmail: string;
  travelDate: Date;
  endDate: Date;
  numberOfTravelers: number;
  oldStatus: string;
  newStatus: string;
  oldPaymentStatus?: string;
  newPaymentStatus?: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No Show',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  CONFIRMED: '#1a5632',
  IN_PROGRESS: '#2563eb',
  COMPLETED: '#16a34a',
  CANCELLED: '#dc2626',
  NO_SHOW: '#6b7280',
};

const PAYMENT_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  DEPOSIT_PAID: 'Deposit Paid',
  PARTIALLY_PAID: 'Partially Paid',
  FULLY_PAID: 'Fully Paid',
  REFUNDED: 'Refunded',
  CANCELLED: 'Cancelled',
};

function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function sendBookingStatusUpdateEmail(data: BookingStatusUpdateData) {
  const companyEmail = process.env.COMPANY_EMAIL || 'info@senzalucesafaris.com';
  const companyPhone = process.env.COMPANY_PHONE || '+255 629 123 246';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://senzalucesafaris.com';

  const statusLabel = STATUS_LABELS[data.newStatus] || data.newStatus;
  const statusColor = STATUS_COLORS[data.newStatus] || '#6b7280';
  const oldStatusLabel = STATUS_LABELS[data.oldStatus] || data.oldStatus;

  const subject = `Booking ${statusLabel} — Ref: ${data.bookingRef} — Senza Luce Safaris`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Status Update</title>
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
                  <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Booking Status Update</p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 24px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    Dear ${data.customerFirstName},
                  </p>

                  <p style="margin: 0 0 24px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    We are writing to inform you that your safari booking has been updated. Here are the details:
                  </p>

                  <!-- Reference Number -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff9e6; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 20px; margin-bottom: 24px;">
                    <tr>
                      <td>
                        <p style="margin: 0; color: #333333; font-size: 14px;">
                          <strong>Your Reference Number:</strong><br>
                          <span style="font-size: 24px; font-weight: bold; color: #1a5632; font-family: monospace;">${data.bookingRef}</span>
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Status Change -->
                  <h3 style="margin: 0 0 16px 0; color: #1a5632; font-size: 18px; font-weight: 600;">Status Update</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 6px; padding: 24px; margin-bottom: 24px;">
                    <tr>
                      <td>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px;">Previous Status</td>
                            <td style="padding: 8px 0; font-size: 14px; text-align: right; font-weight: 500;">
                              <span style="color: #666666;">${oldStatusLabel}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px;">New Status</td>
                            <td style="padding: 8px 0; font-size: 14px; text-align: right; font-weight: 600;">
                              <span style="color: ${statusColor}; font-size: 16px;">${statusLabel}</span>
                            </td>
                          </tr>
                          ${data.oldPaymentStatus && data.newPaymentStatus && data.oldPaymentStatus !== data.newPaymentStatus ? `
                          <tr>
                            <td colspan="2" style="padding: 8px 0 0 0;"><hr style="border: none; border-top: 1px solid #e5e5e5; margin: 0;"></td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px;">Payment Status</td>
                            <td style="padding: 8px 0; font-size: 14px; text-align: right; font-weight: 500; color: #1a5632;">
                              ${PAYMENT_LABELS[data.newPaymentStatus] || data.newPaymentStatus}
                            </td>
                          </tr>
                          ` : ''}
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Booking Details -->
                  <h3 style="margin: 0 0 16px 0; color: #1a5632; font-size: 18px; font-weight: 600;">Booking Details</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 6px; padding: 24px; margin-bottom: 24px;">
                    <tr>
                      <td>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px;">Tour</td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px; text-align: right; font-weight: 500;">${data.tourName}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px;">Travel Dates</td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px; text-align: right; font-weight: 500;">${formatDate(data.travelDate)} — ${formatDate(data.endDate)}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px;">Travelers</td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px; text-align: right; font-weight: 500;">${data.numberOfTravelers} ${data.numberOfTravelers === 1 ? 'person' : 'people'}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  ${data.newStatus === 'CONFIRMED' ? `
                  <!-- Confirmed Message -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e8f5e9; border-left: 4px solid #1a5632; border-radius: 4px; padding: 20px; margin-bottom: 24px;">
                    <tr>
                      <td>
                        <p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.6;">
                          <strong>Your booking is confirmed!</strong><br>
                          Our team is now preparing your complete safari itinerary. You will receive your detailed day-by-day plan, accommodation confirmations, and pickup instructions soon.
                        </p>
                      </td>
                    </tr>
                  </table>
                  ` : ''}

                  ${data.newStatus === 'COMPLETED' ? `
                  <!-- Completed Message -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e8f5e9; border-left: 4px solid #16a34a; border-radius: 4px; padding: 20px; margin-bottom: 24px;">
                    <tr>
                      <td>
                        <p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.6;">
                          <strong>Your safari is complete!</strong><br>
                          We hope you had an amazing experience in Tanzania! We would love to hear about your journey. If you have a moment, please share your feedback with us.
                        </p>
                      </td>
                    </tr>
                  </table>
                  ` : ''}

                  ${data.newStatus === 'CANCELLED' ? `
                  <!-- Cancelled Message -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; border-left: 4px solid #dc2626; border-radius: 4px; padding: 20px; margin-bottom: 24px;">
                    <tr>
                      <td>
                        <p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.6;">
                          <strong>Your booking has been cancelled.</strong><br>
                          If you believe this was done in error or would like to rebook, please contact us and we will be happy to assist you.
                        </p>
                      </td>
                    </tr>
                  </table>
                  ` : ''}

                  <!-- Contact Info -->
                  <p style="margin: 0 0 16px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    If you have any questions about your booking, please do not hesitate to contact us:
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

                  <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6;">
                    Warm regards,<br>
                    <strong style="color: #1a5632;">The Senza Luce Safaris Team</strong>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f5f5f5; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
                  <p style="margin: 0 0 8px 0; color: #666666; font-size: 14px; font-weight: 500;">
                    Senza Luce Safaris
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
    to: data.customerEmail,
    subject,
    html,
  });
}
