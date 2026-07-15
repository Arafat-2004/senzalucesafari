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
  SITE_URL,
} from './templates';

interface ReviewAcknowledgmentData {
  customerName: string;
  customerEmail: string;
  tourName: string;
  rating: number;
  title: string;
}

export async function sendReviewAcknowledgmentEmail(data: ReviewAcknowledgmentData) {
  const firstName = data.customerName.split(' ')[0] || 'there';
  const subject = `Thank You for Your Review — Senza Luce Safaris`;

  const stars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating);

  const html = `
    ${emailHeader({ subject, preheader: `Thank you for sharing your experience with ${data.tourName}!` })}
    ${brandedHeader('Thank You for Your Review')}
    ${customerBlock(`
      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        Dear ${escapeHtml(firstName)},
      </p>

      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        Thank you for taking the time to share your experience! Your feedback helps other travelers discover the magic of a Tanzania safari and helps us improve our services.
      </p>

      <h3 style="margin:0 0 16px 0;color:#1a5632;font-size:18px;font-weight:600;">Your Review</h3>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9;border-radius:6px;padding:24px;margin-bottom:24px;">
        <tr>
          <td>
            <p style="margin:0 0 8px 0;color:#f59e0b;font-size:20px;letter-spacing:2px;">${stars}</p>
            <p style="margin:0 0 8px 0;color:#333333;font-size:16px;font-weight:600;">${escapeHtml(data.title)}</p>
            <p style="margin:0;color:#666666;font-size:14px;">Tour: ${escapeHtml(data.tourName)}</p>
          </td>
        </tr>
      </table>

      ${infoBox('Review Status', 'Your review has been submitted and is now pending approval. Once approved by our team, it will be published on our website to help other travelers make informed decisions.')}

      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        We truly appreciate your support and trust in Senza Luce Safaris. If there is anything we could have done differently, please do not hesitate to reach out — your feedback is invaluable.
      </p>

      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        Would you like to share your safari story with friends? Feel free to forward this email or share your experience on social media.
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
