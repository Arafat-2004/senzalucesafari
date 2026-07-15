import { sendEmail } from './sender';
import {
  emailHeader,
  emailFooter,
  brandedHeader,
  brandedFooter,
  customerBlock,
  referenceBox,
  dataTable,
  infoBox,
  signature,
  escapeHtml,
  formatDate,
  SITE_URL,
  COMPANY_PHONE,
} from './templates';

interface BookingConfirmationData {
  bookingRef: string;
  tourName: string;
  customerFirstName: string;
  customerEmail: string;
  travelDate: Date;
  endDate: Date;
  numberOfTravelers: number;
  accommodationLevel: string;
  totalPrice: number;
  currency: string;
  pricePerPerson: number;
}

const ACCOMMODATION_LABELS: Record<string, string> = {
  budget: 'Budget',
  'mid-range': 'Mid-Range',
  luxury: 'Luxury',
  premium: 'Premium',
};

export async function sendBookingConfirmationEmail(data: BookingConfirmationData) {
  const accommodation = ACCOMMODATION_LABELS[data.accommodationLevel] || data.accommodationLevel;

  const subject = `Booking Confirmed — Ref: ${data.bookingRef} — Senza Luce Safaris`;

  const html = `
    ${emailHeader({ subject, preheader: `Your safari booking ${data.bookingRef} is confirmed! Tour: ${data.tourName}` })}
    ${brandedHeader('Booking Confirmation')}
    ${customerBlock(`
      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        Dear ${escapeHtml(data.customerFirstName)},
      </p>

      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        Thank you for booking your Tanzania safari with Senza Luce Safaris! We are excited to help you create unforgettable memories. Your booking has been received and is being processed.
      </p>

      ${referenceBox(data.bookingRef)}

      <h3 style="margin:0 0 16px 0;color:#1a5632;font-size:18px;font-weight:600;">Booking Details</h3>
      ${dataTable([
        ['Tour', data.tourName],
        ['Travel Dates', `${formatDate(data.travelDate)} — ${formatDate(data.endDate)}`],
        ['Travelers', `${data.numberOfTravelers} ${data.numberOfTravelers === 1 ? 'person' : 'people'}`],
        ['Accommodation', accommodation],
        ['Price per Person', `$${data.pricePerPerson.toLocaleString()} ${data.currency}`],
        ['Total Price', `<strong style="color:#1a5632;font-size:16px;">$${data.totalPrice.toLocaleString()} ${data.currency}</strong>`],
      ])}

      ${infoBox('What happens next?', `Our safari team is reviewing your booking. You will receive a <strong>confirmation email</strong> once your booking is fully confirmed with your detailed itinerary and pickup instructions. This usually takes <strong>24-48 hours</strong>.`)}

      <h3 style="margin:0 0 16px 0;color:#1a5632;font-size:18px;font-weight:600;">Important Information</h3>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9;border-radius:6px;padding:24px;margin-bottom:24px;">
        <tr>
          <td>
            <p style="margin:0 0 12px 0;color:#333333;font-size:14px;line-height:1.6;">
              <strong>Visa:</strong> Most nationalities require a visa to enter Tanzania. We recommend applying for an e-visa before your trip.
            </p>
            <p style="margin:0 0 12px 0;color:#333333;font-size:14px;line-height:1.6;">
              <strong>Vaccinations:</strong> Please consult your travel doctor for recommended vaccinations.
            </p>
            <p style="margin:0;color:#333333;font-size:14px;line-height:1.6;">
              <strong>Insurance:</strong> Comprehensive travel insurance is strongly recommended.
            </p>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 16px 0;color:#333333;font-size:16px;line-height:1.6;">
        Keep your reference number handy — you can use it to check your booking status anytime.
      </p>

      <p style="margin:0 0 16px 0;color:#333333;font-size:16px;line-height:1.6;">
        For questions, contact us at <a href="tel:${COMPANY_PHONE}" style="color:#1a5632;text-decoration:none;">${COMPANY_PHONE}</a> or reply to this email.
      </p>

      ${signature()}
    `)}
    ${brandedFooter()}
    ${emailFooter()}
  `;

  return sendEmail({
    to: data.customerEmail,
    subject,
    html,
  });
}
