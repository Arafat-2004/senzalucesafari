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

interface ReviewApprovedData {
  customerName: string;
  customerEmail: string;
  tourName: string;
  rating: number;
  title: string;
}

export async function sendReviewApprovedEmail(data: ReviewApprovedData) {
  const firstName = data.customerName.split(' ')[0] || 'there';
  const subject = `Your Review is Now Live — Senza Luce Safaris`;

  const stars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating);

  const html = `
    ${emailHeader({ subject, preheader: `Great news! Your review for ${data.tourName} has been approved and is now live.` })}
    ${brandedHeader('Your Review is Live!')}
    ${customerBlock(`
      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        Dear ${escapeHtml(firstName)},
      </p>

      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        Great news! Your review has been approved and is now published on our website. Other travelers can now see your experience and be inspired to book their own Tanzania safari.
      </p>

      <h3 style="margin:0 0 16px 0;color:#1a5632;font-size:18px;font-weight:600;">Your Published Review</h3>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9;border-radius:6px;padding:24px;margin-bottom:24px;">
        <tr>
          <td>
            <p style="margin:0 0 8px 0;color:#f59e0b;font-size:20px;letter-spacing:2px;">${stars}</p>
            <p style="margin:0 0 8px 0;color:#333333;font-size:16px;font-weight:600;">${escapeHtml(data.title)}</p>
            <p style="margin:0;color:#666666;font-size:14px;">Tour: ${escapeHtml(data.tourName)}</p>
          </td>
        </tr>
      </table>

      ${infoBox('See it live!', `Your review is now visible to all visitors. <a href="${SITE_URL}/safaris-tours" style="color:#1a5632;">Browse our tours</a> to see your review in action.`)}

      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        Thank you for helping fellow travelers discover the beauty of Tanzania. Your voice makes a difference!
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
