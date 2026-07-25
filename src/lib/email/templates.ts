const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://senzalucesafari.com';
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'info@senzalucesafari.com';
const COMPANY_PHONE = process.env.COMPANY_PHONE || '+255 699 209 980';

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
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#faf8f5;color:#2c302d;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>` : ''}
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf8f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(12,35,23,0.05);border:1px solid #e5e8e6;">`;
}

export function emailFooter({ adminDashboard = false }: { adminDashboard?: boolean } = {}) {
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
            <td style="background-color:#0c2317;padding:40px;text-align:center;border-bottom:4px solid #b5893e;">
              <div style="font-family:'Times New Roman',Georgia,serif;font-size:24px;font-weight:bold;color:#ffffff;letter-spacing:0.18em;text-transform:uppercase;margin:0 0 8px 0;">Senza Luce Safari</div>
              <div style="font-family:'Times New Roman',Georgia,serif;font-size:12px;font-style:italic;color:#b5893e;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 16px 0;">Bespoke Expeditions & Safaris</div>
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;font-family:system-ui,-apple-system,sans-serif;letter-spacing:-0.01em;">${escapeHtml(subtitle || title)}</h1>
            </td>
          </tr>`;
}

export function brandedFooter({ adminDashboard = false }: { adminDashboard?: boolean } = {}) {
  return `
          <tr>
            <td style="background-color:#0c2317;padding:32px 40px;text-align:center;border-top:1px solid #e5e8e6;color:#ffffff;">
              <p style="margin:0 0 12px 0;font-family:'Times New Roman',Georgia,serif;font-size:18px;font-weight:bold;color:#b5893e;letter-spacing:0.1em;text-transform:uppercase;">Senza Luce Safari</p>
              <p style="margin:0 0 20px 0;color:#a2ada5;font-size:12px;line-height:1.8;">
                Arusha, Tanzania<br>
                Phone: ${COMPANY_PHONE} | Email: ${COMPANY_EMAIL}<br>
                <a href="${SITE_URL}" style="color:#b5893e;text-decoration:none;font-weight:600;">www.senzalucesafari.com</a>
              </p>
              <div style="margin:0 0 20px 0;">
                <a href="https://instagram.com/senzalucesafari" style="display:inline-block;margin:0 8px;color:#b5893e;text-decoration:none;font-size:12px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">Instagram</a>
                <span style="color:#a2ada5;">•</span>
                <a href="https://facebook.com/senzalucesafari" style="display:inline-block;margin:0 8px;color:#b5893e;text-decoration:none;font-size:12px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">Facebook</a>
                <span style="color:#a2ada5;">•</span>
                <a href="https://wa.me/255699209980" style="display:inline-block;margin:0 8px;color:#b5893e;text-decoration:none;font-size:12px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">WhatsApp Support</a>
              </div>
              <p style="margin:0;color:#6d7a71;font-size:10px;">
                © ${new Date().getFullYear()} Senza Luce Safaris. All rights reserved.
              </p>
            </td>
          </tr>`;
}

export function adminFooter() {
  return `
          <tr>
            <td style="background-color:#0c2317;padding:32px 40px;text-align:center;border-top:1px solid #e5e8e6;color:#ffffff;">
              <p style="margin:0 0 8px 0;font-family:'Times New Roman',Georgia,serif;font-size:16px;font-weight:bold;color:#b5893e;letter-spacing:0.05em;text-transform:uppercase;">System Notification</p>
              <p style="margin:0;color:#a2ada5;font-size:12px;line-height:1.6;">
                This is an automated operational email from the Senza Luce Admin Console.<br>
                Arusha, Tanzania | support@senzalucesafari.com
              </p>
            </td>
          </tr>`;
}

export function customerBlock(content: string) {
  return `
          <tr>
            <td style="padding:40px;background-color:#ffffff;line-height:1.7;font-size:15px;color:#2c302d;">
              ${content}
            </td>
          </tr>`;
}

export function infoBox(title: string, content: string, color = '#b5893e', bgColor = '#fdfcfa') {
  return `
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${bgColor};border-left:4px solid ${color};border-radius:6px;padding:20px;margin-bottom:24px;border-top:1px solid #e5e8e6;border-right:1px solid #e5e8e6;border-bottom:1px solid #e5e8e6;">
                    <tr>
                      <td>
                        <p style="margin:0;color:#2c302d;font-size:14px;line-height:1.6;">
                          <strong style="color:#0c2317;font-size:15px;">${escapeHtml(title)}</strong><br>
                          ${content}
                        </p>
                      </td>
                    </tr>
                  </table>`;
}

export function referenceBox(ref: string, label = 'Your Reference Number') {
  return `
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdfcfa;border-left:4px solid #b5893e;border-radius:6px;padding:20px;margin-bottom:24px;border-top:1px solid #e5e8e6;border-right:1px solid #e5e8e6;border-bottom:1px solid #e5e8e6;">
                    <tr>
                      <td>
                        <p style="margin:0;color:#2c302d;font-size:14px;">
                          <strong style="color:#6d7a71;text-transform:uppercase;font-size:11px;letter-spacing:0.05em;">${escapeHtml(label)}</strong><br>
                          <span style="font-size:24px;font-weight:bold;color:#0c2317;font-family:monospace;letter-spacing:0.05em;display:block;margin-top:4px;">${escapeHtml(ref)}</span>
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
                            <td style="padding:10px 0;color:#6d7a71;font-size:13px;border-bottom:1px solid #f2f5f3;">${escapeHtml(label)}</td>
                            <td style="padding:10px 0;color:#2c302d;font-size:13px;text-align:right;font-weight:600;border-bottom:1px solid #f2f5f3;">${value}</td>
                          </tr>`
    )
    .join('');

  return `
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #e5e8e6;border-radius:8px;padding:20px;margin-bottom:24px;">
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
                        <a href="${escapeHtml(href)}" style="display:inline-block;background-color:#b5893e;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:bold;letter-spacing:0.05em;text-transform:uppercase;box-shadow:0 4px 6px rgba(181,137,98,0.15);">${escapeHtml(label)}</a>
                      </td>
                    </tr>
                  </table>`;
}

export function signature() {
  return `
                  <p style="margin:24px 0 0 0;color:#2c302d;font-size:15px;line-height:1.6;">
                    Warm regards,<br>
                    <strong style="color:#0c2317;font-family:'Times New Roman',Georgia,serif;font-size:16px;">Senza Luce Safaris Team</strong>
                  </p>`;
}

export { escapeHtml, formatDate, SITE_URL, COMPANY_EMAIL, COMPANY_PHONE };
