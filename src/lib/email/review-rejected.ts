import { sendEmail } from './sender';
import {
  emailHeader,
  emailFooter,
  brandedHeader,
  brandedFooter,
  customerBlock,
  infoBox,
  signature,
  escapeHtml,
} from './templates';

interface ReviewRejectedData {
  customerName: string;
  customerEmail: string;
  tourName: string;
  title: string;
  reason?: string;
}

export async function sendReviewRejectedEmail(data: ReviewRejectedData) {
  const firstName = data.customerName.split(' ')[0] || 'there';
  const subject = `Update on Your Review — Senza Luce Safaris`;

  const html = `
    ${emailHeader({ subject, preheader: `An update regarding your review for ${data.tourName}` })}
    ${brandedHeader('Review Update')}
    ${customerBlock(`
      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        Dear ${escapeHtml(firstName)},
      </p>

      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        Thank you for submitting a review for <strong>${escapeHtml(data.tourName)}</strong>. After careful review by our team, we were unable to publish your review at this time.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9;border-radius:6px;padding:24px;margin-bottom:24px;">
        <tr>
          <td>
            <p style="margin:0 0 8px 0;color:#333333;font-size:16px;font-weight:600;">${escapeHtml(data.title)}</p>
            <p style="margin:0;color:#666666;font-size:14px;">Tour: ${escapeHtml(data.tourName)}</p>
          </td>
        </tr>
      </table>

      ${data.reason ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff9e6;border-left:4px solid #f59e0b;border-radius:4px;padding:20px;margin-bottom:24px;">
        <tr>
          <td>
            <p style="margin:0;color:#333333;font-size:15px;line-height:1.6;">
              <strong>Reason:</strong><br>
              ${escapeHtml(data.reason)}
            </p>
          </td>
        </tr>
      </table>
      ` : ''}

      ${infoBox('What you can do', 'You are welcome to submit a new review that follows our <a href="#" style="color:#1a5632;">review guidelines</a>. We value your feedback and want to hear about your experience. If you have any questions, please contact us directly.')}

      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        We appreciate your understanding and look forward to hearing about your safari experience.
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
