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
  ctaButton,
  signature,
  escapeHtml,
  formatDate,
  COMPANY_EMAIL,
  COMPANY_PHONE,
  SITE_URL,
} from './templates';

interface BookingStatusUpdateData {
  bookingRef: string;
  tourName: string;
  tourSlug?: string;
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

const PAYMENT_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  DEPOSIT_PAID: 'Deposit Paid',
  PARTIALLY_PAID: 'Partially Paid',
  FULLY_PAID: 'Fully Paid',
  REFUNDED: 'Refunded',
  CANCELLED: 'Cancelled',
};

function statusMessage(data: BookingStatusUpdateData) {
  if (data.newStatus === 'CONFIRMED') {
    return infoBox('Your booking is confirmed', 'Our team is preparing your complete safari plan, accommodation confirmations, and pickup details.', '#176b45', '#f6f8f6');
  }
  if (data.newStatus === 'COMPLETED') {
    const reviewUrl = data.tourSlug
      ? `${SITE_URL.replace(/\/$/, '')}/safaris-tours/${data.tourSlug}#reviews`
      : `${SITE_URL.replace(/\/$/, '')}/safaris-tours`;

    return `
      ${infoBox('Your safari is complete', 'We hope your Tanzania safari was unforgettable. Your feedback helps future travelers choose with confidence and helps our team keep improving.', '#d6a84b', '#fff8e7')}
      ${ctaButton(reviewUrl, 'Share Your Review')}
    `;
  }
  if (data.newStatus === 'CANCELLED') {
    return infoBox('Booking cancelled', 'If this was unexpected or you would like to reschedule, please contact our team and we will help you with the next step.', '#dc2626', '#fef2f2');
  }
  if (data.newStatus === 'IN_PROGRESS') {
    return infoBox('Your safari is underway', 'Our team remains available during the trip. If you need assistance, contact us directly using the details below.', '#2563eb', '#eff6ff');
  }
  return '';
}

export async function sendBookingStatusUpdateEmail(data: BookingStatusUpdateData) {
  const statusLabel = STATUS_LABELS[data.newStatus] || data.newStatus;
  const oldStatusLabel = STATUS_LABELS[data.oldStatus] || data.oldStatus;
  const subject = `Booking ${statusLabel} — Ref: ${data.bookingRef} — Senza Luce Safari`;
  const paymentChanged = data.oldPaymentStatus && data.newPaymentStatus && data.oldPaymentStatus !== data.newPaymentStatus;

  const rows: [string, string][] = [
    ['Previous status', escapeHtml(oldStatusLabel)],
    ['New status', `<strong style="color:#176b45;">${escapeHtml(statusLabel)}</strong>`],
    ...(paymentChanged ? [['External payment record', escapeHtml(PAYMENT_LABELS[data.newPaymentStatus!] || data.newPaymentStatus!)] as [string, string]] : []),
    ['Tour', escapeHtml(data.tourName)],
    ['Travel dates', `${formatDate(data.travelDate)} — ${formatDate(data.endDate)}`],
    ['Travelers', `${data.numberOfTravelers} ${data.numberOfTravelers === 1 ? 'person' : 'people'}`],
  ];

  const html = `
    ${emailHeader({ subject, preheader: `Your booking ${data.bookingRef} is now ${statusLabel}.` })}
    ${brandedHeader('Booking Update', `Your booking is now ${statusLabel}`)}
    ${customerBlock(`
      <p style="margin:0 0 20px 0;color:#17231c;font-size:16px;line-height:1.7;">
        Dear ${escapeHtml(data.customerFirstName)},
      </p>

      <p style="margin:0 0 22px 0;color:#17231c;font-size:16px;line-height:1.7;">
        We are writing to let you know that your safari booking status has been updated.
      </p>

      ${referenceBox(data.bookingRef)}

      <h3 style="margin:0 0 14px 0;color:#17231c;font-size:18px;font-weight:750;">Booking Summary</h3>
      ${dataTable(rows)}

      ${statusMessage(data)}

      <p style="margin:0 0 16px 0;color:#17231c;font-size:15px;line-height:1.7;">
        For questions, contact us at
        <a href="tel:${COMPANY_PHONE}" style="color:#176b45;text-decoration:none;font-weight:700;">${COMPANY_PHONE}</a>
        or
        <a href="mailto:${COMPANY_EMAIL}" style="color:#176b45;text-decoration:none;font-weight:700;">${COMPANY_EMAIL}</a>.
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
    category: 'bookings',
  });
}
