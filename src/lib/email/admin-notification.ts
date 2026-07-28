import { sendEmail } from './sender';
import { logger } from "@/lib/reliability/logger";
import {
  emailHeader,
  emailFooter,
  brandedHeader,
  adminFooter,
  customerBlock,
  dataTable,
  infoBox,
  ctaButton,
  escapeHtml,
  formatDate,
  SITE_URL,
} from './templates';

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

export async function sendAdminNotificationEmail(inquiry: InquiryData) {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    logger.error('[Email] ADMIN_EMAIL not configured');
    return { success: false, error: 'ADMIN_EMAIL not configured' };
  }

  const subject = `New safari inquiry — ${inquiry.name}`;
  const adminUrl = `${SITE_URL.replace(/\/$/, '')}/admin/inquiries`;
  const rows: [string, string][] = [
    ['Customer', escapeHtml(inquiry.name)],
    ['Email', `<a href="mailto:${escapeHtml(inquiry.email)}" style="color:#176b45;text-decoration:none;font-weight:700;">${escapeHtml(inquiry.email)}</a>`],
    ...(inquiry.phone ? [['Phone', escapeHtml(inquiry.phone)] as [string, string]] : []),
    ...(inquiry.country ? [['Country', escapeHtml(inquiry.country)] as [string, string]] : []),
    ['Inquiry type', escapeHtml(inquiry.inquiryType.replace(/_/g, ' '))],
    ...(inquiry.tourInterest ? [['Safari interest', escapeHtml(inquiry.tourInterest)] as [string, string]] : []),
    ...(inquiry.travelDate ? [['Preferred date', formatDate(inquiry.travelDate)] as [string, string]] : []),
    ...(inquiry.numberOfTravelers ? [['Travelers', String(inquiry.numberOfTravelers)] as [string, string]] : []),
    ['Submitted', escapeHtml(inquiry.createdAt.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }))],
    ['Inquiry ID', escapeHtml(inquiry.id)],
  ];

  const html = `
    ${emailHeader({ subject, preheader: 'A new customer inquiry was submitted from the public website.' })}
    ${brandedHeader('Admin Alert', 'New safari inquiry received')}
    ${customerBlock(`
      <p style="margin:0 0 20px 0;color:#17231c;font-size:16px;line-height:1.7;">
        A new inquiry has been submitted through the website. Review the customer details, travel context, and message before replying.
      </p>

      <h3 style="margin:0 0 14px 0;color:#17231c;font-size:18px;font-weight:750;">Inquiry Details</h3>
      ${dataTable(rows)}

      ${infoBox('Customer message', `<span style="white-space:pre-wrap;">${escapeHtml(inquiry.message)}</span>`, '#d6a84b', '#fff8e7')}

      ${ctaButton(adminUrl, 'Open in Admin Dashboard')}
    `)}
    ${adminFooter()}
    ${emailFooter()}
  `;

  return sendEmail({
    to: adminEmail,
    subject,
    html,
    category: 'contact',
  });
}
