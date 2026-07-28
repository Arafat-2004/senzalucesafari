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
  COMPANY_EMAIL,
  COMPANY_PHONE,
} from './templates';

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

export async function sendCustomerConfirmationEmail(inquiry: InquiryData) {
  const firstName = inquiry.name.split(' ')[0] || 'there';
  const subject = `We received your safari inquiry — Senza Luce Safaris`;

  const summaryRows: [string, string][] = [
    ...(inquiry.tourInterest ? [['Safari interest', escapeHtml(inquiry.tourInterest)] as [string, string]] : []),
    ...(inquiry.travelDate ? [['Preferred date', formatDate(inquiry.travelDate)] as [string, string]] : []),
    ...(inquiry.numberOfTravelers ? [['Travelers', `${inquiry.numberOfTravelers} ${inquiry.numberOfTravelers === 1 ? 'person' : 'people'}`] as [string, string]] : []),
    ['Inquiry type', escapeHtml(inquiry.inquiryType.replace(/_/g, ' ').toLowerCase())],
  ];

  const html = `
    ${emailHeader({ subject, preheader: 'Our safari team has received your request and will respond with next steps.' })}
    ${brandedHeader('Inquiry Received', 'Your Tanzania safari request is safely with our team')}
    ${customerBlock(`
      <p style="margin:0 0 20px 0;color:#17231c;font-size:16px;line-height:1.7;">
        Dear ${escapeHtml(firstName)},
      </p>

      <p style="margin:0 0 22px 0;color:#17231c;font-size:16px;line-height:1.7;">
        Thank you for reaching out to Senza Luce Safaris. We have received your inquiry and our team will review the details carefully before responding with helpful next steps.
      </p>

      ${referenceBox(inquiry.id, 'Inquiry Reference')}

      <h3 style="margin:0 0 14px 0;color:#17231c;font-size:18px;font-weight:750;">Inquiry Summary</h3>
      ${dataTable(summaryRows)}

      ${infoBox('What happens next?', 'A safari specialist will review your travel dates, group size, interests, and message. We normally respond within <strong>24–48 hours</strong> with guidance or a tailored itinerary direction.', '#176b45', '#f6f8f6')}

      <p style="margin:0 0 16px 0;color:#17231c;font-size:15px;line-height:1.7;">
        If your request is urgent, you can contact us directly at
        <a href="tel:${COMPANY_PHONE}" style="color:#176b45;text-decoration:none;font-weight:700;">${COMPANY_PHONE}</a>
        or
        <a href="mailto:${COMPANY_EMAIL}" style="color:#176b45;text-decoration:none;font-weight:700;">${COMPANY_EMAIL}</a>.
      </p>

      <p style="margin:0;color:#5b6b62;font-size:14px;line-height:1.7;">
        Keep this email for your records. Your reference helps our team find your request quickly.
      </p>

      ${signature()}
    `)}
    ${brandedFooter()}
    ${emailFooter()}
  `;

  return sendEmail({
    to: inquiry.email,
    subject,
    html,
    category: 'contact',
  });
}
