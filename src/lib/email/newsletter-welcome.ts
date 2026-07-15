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

interface NewsletterWelcomeData {
  email: string;
}

export async function sendNewsletterWelcomeEmail(data: NewsletterWelcomeData) {
  const firstName = data.email.split('@')[0];
  const subject = 'Welcome to the Senza Luce Safaris Newsletter!';

  const html = `
    ${emailHeader({ subject, preheader: 'Thank you for subscribing to our safari newsletter!' })}
    ${brandedHeader('Welcome Aboard!')}
    ${customerBlock(`
      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        Hi ${escapeHtml(firstName)},
      </p>

      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        Thank you for subscribing to the Senza Luce Safaris newsletter! You have joined a community of safari enthusiasts who receive exclusive updates about Tanzania wildlife adventures.
      </p>

      <h3 style="margin:0 0 16px 0;color:#1a5632;font-size:18px;font-weight:600;">What to Expect</h3>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9;border-radius:6px;padding:24px;margin-bottom:24px;">
        <tr>
          <td>
            <p style="margin:0 0 12px 0;color:#333333;font-size:15px;line-height:1.6;">
              <strong style="color:#1a5632;">Safari Tips & Guides</strong> — Expert advice for planning your Tanzania adventure
            </p>
            <p style="margin:0 0 12px 0;color:#333333;font-size:15px;line-height:1.6;">
              <strong style="color:#1a5632;">Special Offers</strong> — Exclusive deals and early-bird discounts on our most popular tours
            </p>
            <p style="margin:0 0 12px 0;color:#333333;font-size:15px;line-height:1.6;">
              <strong style="color:#1a5632;">Wildlife Updates</strong> — Seasonal migration news and wildlife sighting reports
            </p>
            <p style="margin:0;color:#333333;font-size:15px;line-height:1.6;">
              <strong style="color:#1a5632;">Destination Highlights</strong> — Discover hidden gems and must-see attractions in Tanzania
            </p>
          </td>
        </tr>
      </table>

      ${infoBox('Ready to start planning?', `Browse our <a href="${SITE_URL}/safaris-tours" style="color:#1a5632;">featured safaris</a> or <a href="${SITE_URL}/contact" style="color:#1a5632;">contact our team</a> for a personalized itinerary.`)}

      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        We respect your inbox — our emails are sent no more than twice a month, and you can unsubscribe at any time.
      </p>

      ${signature()}
    `)}
    ${brandedFooter()}
    ${emailFooter()}
  `;

  return sendEmail({
    to: data.email,
    subject,
    html,
  });
}
