const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://senzalucesafaris.com';
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'info@senzalucesafaris.com';
const COMPANY_PHONE = process.env.COMPANY_PHONE || '+255 629 123 246';

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
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#f5f5f5;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>` : ''}
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">`;
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
            <td style="background-color:#1a5632;padding:30px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:600;">Senza Luce Safaris</h1>
              <p style="margin:8px 0 0 0;color:#ffffff;font-size:14px;opacity:0.9;">${escapeHtml(subtitle || title)}</p>
            </td>
          </tr>`;
}

export function brandedFooter({ adminDashboard = false }: { adminDashboard?: boolean } = {}) {
  return `
          <tr>
            <td style="background-color:#f5f5f5;padding:24px 40px;text-align:center;border-top:1px solid #e5e5e5;">
              <p style="margin:0 0 8px 0;color:#666666;font-size:14px;font-weight:500;">Senza Luce Safaris</p>
              <p style="margin:0;color:#666666;font-size:12px;line-height:1.6;">
                Arusha, Tanzania<br>
                ${COMPANY_PHONE} | ${COMPANY_EMAIL}<br>
                <a href="${SITE_URL}" style="color:#1a5632;text-decoration:none;">www.senzalucesafaris.com</a>
              </p>
            </td>
          </tr>`;
}

export function adminFooter() {
  return `
          <tr>
            <td style="background-color:#f5f5f5;padding:24px 40px;text-align:center;border-top:1px solid #e5e5e5;">
              <p style="margin:0;color:#666666;font-size:12px;line-height:1.6;">
                This is an automated notification from Senza Luce Safaris<br>
                Arusha, Tanzania | ${COMPANY_PHONE}
              </p>
            </td>
          </tr>`;
}

export function customerBlock(content: string) {
  return `
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>`;
}

export function infoBox(title: string, content: string, color = '#1a5632', bgColor = '#e8f5e9') {
  return `
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${bgColor};border-left:4px solid ${color};border-radius:4px;padding:20px;margin-bottom:24px;">
                    <tr>
                      <td>
                        <p style="margin:0;color:#333333;font-size:15px;line-height:1.6;">
                          <strong>${escapeHtml(title)}</strong><br>
                          ${content}
                        </p>
                      </td>
                    </tr>
                  </table>`;
}

export function referenceBox(ref: string, label = 'Your Reference Number') {
  return `
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff9e6;border-left:4px solid #f59e0b;border-radius:4px;padding:20px;margin-bottom:24px;">
                    <tr>
                      <td>
                        <p style="margin:0;color:#333333;font-size:14px;">
                          <strong>${escapeHtml(label)}:</strong><br>
                          <span style="font-size:24px;font-weight:bold;color:#1a5632;font-family:monospace;">${escapeHtml(ref)}</span>
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
                            <td style="padding:8px 0;color:#666666;font-size:14px;">${escapeHtml(label)}</td>
                            <td style="padding:8px 0;color:#333333;font-size:14px;text-align:right;font-weight:500;">${value}</td>
                          </tr>`
    )
    .join('');

  return `
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9;border-radius:6px;padding:24px;margin-bottom:24px;">
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
                      <td align="center" style="padding:24px 0;">
                        <a href="${escapeHtml(href)}" style="display:inline-block;background-color:#1a5632;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:16px;font-weight:600;">${escapeHtml(label)}</a>
                      </td>
                    </tr>
                  </table>`;
}

export function signature() {
  return `
                  <p style="margin:0;color:#333333;font-size:16px;line-height:1.6;">
                    Warm regards,<br>
                    <strong style="color:#1a5632;">The Senza Luce Safaris Team</strong>
                  </p>`;
}

export { escapeHtml, formatDate, SITE_URL, COMPANY_EMAIL, COMPANY_PHONE };
