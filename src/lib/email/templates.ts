const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://senzalucesafari.com';
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'info@senzalucesafari.com';
const COMPANY_PHONE = process.env.COMPANY_PHONE || '+255 699 209 980';
const SITE_ORIGIN = SITE_URL.replace(/\/$/, '');
const BRAND_ICON_URL = `${SITE_ORIGIN}/icons/icon-192x192.png`;
const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/senzalucesafari';
const FACEBOOK_URL = process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/senzalucesafari';
const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://wa.me/255699209980';
const SOCIAL_ICONS = {
  instagram: `${SITE_ORIGIN}/icons/social/instagram.svg`,
  facebook: `${SITE_ORIGIN}/icons/social/facebook.svg`,
  whatsapp: `${SITE_ORIGIN}/icons/social/whatsapp.svg`,
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(d: Date | string): string {
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export interface EmailTemplateOptions {
  subject: string;
  preheader?: string;
  bodyContent: string;
}

export function emailHeader({ subject, preheader }: { subject: string; preheader?: string }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#edf2ef;color:#17231c;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>` : ''}
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#edf2ef;padding:32px 12px;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 18px 45px rgba(12,35,23,0.10);border:1px solid #d5ded8;">`;
}

export function emailFooter() {
  return `
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function brandedHeader(title: string, subtitle?: string) {
  return `
          <tr>
            <td style="background:linear-gradient(135deg,#0c1411 0%,#123524 54%,#176b45 100%);padding:34px 40px 36px;text-align:center;border-bottom:4px solid #d6a84b;">
              <img src="${BRAND_ICON_URL}" width="64" height="64" alt="Senza Luce Safari" style="display:block;margin:0 auto 16px;border-radius:18px;border:1px solid rgba(255,255,255,0.25);box-shadow:0 10px 24px rgba(0,0,0,0.24);">
              <div style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;margin:0 0 4px 0;">Senza Luce</div>
              <div style="font-size:11px;font-weight:700;color:#d8eadf;letter-spacing:0.22em;text-transform:uppercase;margin:0 0 18px 0;">Safaris</div>
              <div style="display:inline-block;background-color:rgba(216,234,224,0.12);border:1px solid rgba(216,234,224,0.24);border-radius:999px;padding:8px 16px;color:#eef4f0;font-size:12px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;">${escapeHtml(title)}</div>
              <h1 style="margin:18px 0 0;color:#ffffff;font-size:24px;line-height:1.25;font-weight:750;font-family:system-ui,-apple-system,sans-serif;letter-spacing:-0.03em;">${escapeHtml(subtitle || title)}</h1>
            </td>
          </tr>`;
}

function socialLinksRow() {
  const linkStyle = 'display:inline-block;margin:0 6px;color:#e2b95e;text-decoration:none;font-size:11px;font-weight:800;letter-spacing:0.05em;text-transform:uppercase;';
  const iconStyle = 'display:block;width:28px;height:28px;margin:0 auto 6px;border-radius:8px;';

  return `
              <table cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 20px;">
                <tr>
                  <td align="center" style="padding:0 6px;">
                    <a href="${escapeHtml(INSTAGRAM_URL)}" style="${linkStyle}">
                      <img src="${SOCIAL_ICONS.instagram}" width="28" height="28" alt="Instagram" style="${iconStyle}">
                      Instagram
                    </a>
                  </td>
                  <td align="center" style="padding:0 6px;">
                    <a href="${escapeHtml(FACEBOOK_URL)}" style="${linkStyle}">
                      <img src="${SOCIAL_ICONS.facebook}" width="28" height="28" alt="Facebook" style="${iconStyle}">
                      Facebook
                    </a>
                  </td>
                  <td align="center" style="padding:0 6px;">
                    <a href="${escapeHtml(WHATSAPP_URL)}" style="${linkStyle}">
                      <img src="${SOCIAL_ICONS.whatsapp}" width="28" height="28" alt="WhatsApp" style="${iconStyle}">
                      WhatsApp
                    </a>
                  </td>
                </tr>
              </table>`;
}

export function brandedFooter() {
  return `
          <tr>
            <td style="background-color:#0c1411;padding:30px 40px;text-align:center;border-top:1px solid #2b3b34;color:#ffffff;">
              <img src="${BRAND_ICON_URL}" width="40" height="40" alt="" style="display:block;margin:0 auto 12px;border-radius:12px;">
              <p style="margin:0 0 10px 0;font-size:17px;font-weight:800;color:#eef4f0;letter-spacing:-0.01em;">Senza Luce Safaris</p>
              <p style="margin:0 0 18px 0;color:#a8b6ae;font-size:12px;line-height:1.8;">
                Arusha, Tanzania<br>
                Phone: ${COMPANY_PHONE} | Email: ${COMPANY_EMAIL}<br>
                <a href="${SITE_URL}" style="color:#e2b95e;text-decoration:none;font-weight:700;">www.senzalucesafari.com</a>
              </p>
              ${socialLinksRow()}
              <p style="margin:0;color:#83928a;font-size:10px;">
                © ${new Date().getFullYear()} Senza Luce Safaris. All rights reserved.
              </p>
            </td>
          </tr>`;
}

export function adminFooter() {
  return `
          <tr>
            <td style="background-color:#0c1411;padding:30px 40px;text-align:center;border-top:1px solid #2b3b34;color:#ffffff;">
              <img src="${BRAND_ICON_URL}" width="40" height="40" alt="" style="display:block;margin:0 auto 12px;border-radius:12px;">
              <p style="margin:0 0 8px 0;font-size:16px;font-weight:800;color:#e2b95e;letter-spacing:0.05em;text-transform:uppercase;">System Notification</p>
              <p style="margin:0;color:#a8b6ae;font-size:12px;line-height:1.6;">
                This is an automated operational email from the Senza Luce Admin Console.<br>
                Arusha, Tanzania | support@senzalucesafari.com
              </p>
            </td>
          </tr>`;
}

export function customerBlock(content: string) {
  return `
          <tr>
            <td style="padding:40px;background-color:#ffffff;line-height:1.7;font-size:15px;color:#17231c;">
              ${content}
            </td>
          </tr>`;
}

export function infoBox(title: string, content: string, color = '#176b45', bgColor = '#f6f8f6') {
  return `
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${bgColor};border-left:4px solid ${color};border-radius:14px;padding:20px;margin-bottom:24px;border-top:1px solid #d5ded8;border-right:1px solid #d5ded8;border-bottom:1px solid #d5ded8;">
                    <tr>
                      <td>
                        <p style="margin:0;color:#17231c;font-size:14px;line-height:1.6;">
                          <strong style="color:#17231c;font-size:15px;">${escapeHtml(title)}</strong><br>
                          ${content}
                        </p>
                      </td>
                    </tr>
                  </table>`;
}

export function referenceBox(ref: string, label = 'Your Reference Number') {
  return `
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff8e7;border-left:4px solid #d6a84b;border-radius:14px;padding:20px;margin-bottom:24px;border-top:1px solid #eadcb7;border-right:1px solid #eadcb7;border-bottom:1px solid #eadcb7;">
                    <tr>
                      <td>
                        <p style="margin:0;color:#17231c;font-size:14px;">
                          <strong style="color:#5b6b62;text-transform:uppercase;font-size:11px;letter-spacing:0.08em;">${escapeHtml(label)}</strong><br>
                          <span style="font-size:24px;font-weight:bold;color:#17231c;font-family:monospace;letter-spacing:0.05em;display:block;margin-top:4px;">${escapeHtml(ref)}</span>
                        </p>
                      </td>
                    </tr>
                  </table>`;
}

export function dataTable(rows: [string, string][]) {
  const rowsHtml = rows
    .map(
      ([label, value]) => `
                          <tr>
                            <td style="padding:10px 0;color:#5b6b62;font-size:13px;border-bottom:1px solid #edf2ef;">${escapeHtml(label)}</td>
                            <td style="padding:10px 0;color:#17231c;font-size:13px;text-align:right;font-weight:700;border-bottom:1px solid #edf2ef;">${value}</td>
                          </tr>`
    )
    .join('');

  return `
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #d5ded8;border-radius:16px;padding:20px;margin-bottom:24px;">
                    <tr>
                      <td>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          ${rowsHtml}
                        </table>
                      </td>
                    </tr>
                  </table>`;
}

export function ctaButton(href: string, label: string) {
  return `
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:28px 0;">
                        <a href="${escapeHtml(href)}" style="display:inline-block;background-color:#176b45;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:14px;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;box-shadow:0 8px 18px rgba(23,107,69,0.22);">${escapeHtml(label)}</a>
                      </td>
                    </tr>
                  </table>`;
}

export function signature() {
  return `
                  <p style="margin:24px 0 0 0;color:#17231c;font-size:15px;line-height:1.6;">
                    Warm regards,<br>
                    <strong style="color:#176b45;font-size:16px;">Senza Luce Safaris Team</strong>
                  </p>`;
}

export { escapeHtml, formatDate, SITE_URL, COMPANY_EMAIL, COMPANY_PHONE, BRAND_ICON_URL, INSTAGRAM_URL, FACEBOOK_URL, WHATSAPP_URL };
