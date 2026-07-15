import { sendEmail } from './sender';
import {
  emailHeader,
  emailFooter,
  brandedHeader,
  adminFooter,
  customerBlock,
  referenceBox,
  dataTable,
  ctaButton,
  escapeHtml,
  formatDate,
  SITE_URL,
} from './templates';
import { logger } from '@/lib/reliability/logger';

interface BookingAdminData {
  bookingRef: string;
  tourName: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  phone: string;
  country: string;
  travelDate: Date;
  endDate: Date;
  numberOfTravelers: number;
  accommodationLevel: string;
  totalPrice: number;
  currency: string;
  specialRequests?: string | null;
  createdAt: Date;
}

export async function sendBookingAdminNotificationEmail(data: BookingAdminData) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    logger.error('[Email] ADMIN_EMAIL not configured');
    return { success: false, error: 'ADMIN_EMAIL not configured' };
  }

  const subject = `New Booking — ${data.customerFirstName} ${data.customerLastName} — ${data.tourName}`;

  const html = `
    ${emailHeader({ subject, preheader: `New booking ${data.bookingRef} from ${data.customerFirstName} ${data.customerLastName} for ${data.tourName}` })}
    ${brandedHeader('New Booking Received')}
    ${customerBlock(`
      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        A new booking has been submitted through the website.
      </p>

      ${referenceBox(data.bookingRef)}

      <h3 style="margin:0 0 16px 0;color:#1a5632;font-size:18px;font-weight:600;">Customer Information</h3>
      ${dataTable([
        ['Name', `${data.customerFirstName} ${data.customerLastName}`],
        ['Email', `<a href="mailto:${escapeHtml(data.customerEmail)}" style="color:#1a5632;text-decoration:none;">${escapeHtml(data.customerEmail)}</a>`],
        ['Phone', escapeHtml(data.phone)],
        ['Country', escapeHtml(data.country)],
      ])}

      <h3 style="margin:0 0 16px 0;color:#1a5632;font-size:18px;font-weight:600;">Tour Details</h3>
      ${dataTable([
        ['Tour', data.tourName],
        ['Travel Dates', `${formatDate(data.travelDate)} — ${formatDate(data.endDate)}`],
        ['Travelers', `${data.numberOfTravelers} ${data.numberOfTravelers === 1 ? 'person' : 'people'}`],
        ['Accommodation', data.accommodationLevel],
        ['Total Price', `<strong style="color:#1a5632;font-size:16px;">$${data.totalPrice.toLocaleString()} ${data.currency}</strong>`],
      ])}

      ${data.specialRequests ? `
      <h3 style="margin:0 0 16px 0;color:#1a5632;font-size:18px;font-weight:600;">Special Requests</h3>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9;border-radius:6px;padding:24px;margin-bottom:24px;">
        <tr>
          <td>
            <p style="margin:0;color:#333333;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.specialRequests)}</p>
          </td>
        </tr>
      </table>
      ` : ''}

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9;border-radius:6px;padding:16px;margin-bottom:24px;">
        <tr>
          <td>
            <p style="margin:0;color:#666666;font-size:14px;">
              <strong>Submitted:</strong> ${data.createdAt.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </td>
        </tr>
      </table>

      ${ctaButton(`${SITE_URL}/admin/bookings`, 'View in Admin Dashboard')}
    `)}
    ${adminFooter()}
    ${emailFooter()}
  `;

  return sendEmail({
    to: adminEmail,
    subject,
    html,
  });
}
