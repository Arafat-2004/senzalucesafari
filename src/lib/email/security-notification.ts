import { sendEmail } from './sender';
import {
  emailHeader,
  emailFooter,
  brandedHeader,
  adminFooter,
  customerBlock,
  dataTable,
  escapeHtml,
} from './templates';
import { logger } from '@/lib/reliability/logger';

interface SecurityNotificationData {
  adminEmail: string;
  adminName: string;
  event: 'mfa_enabled' | 'mfa_disabled' | 'password_changed' | 'password_reset' | 'login_new_device';
  ipAddress?: string;
  userAgent?: string;
  timestamp?: Date;
}

const EVENT_LABELS: Record<string, string> = {
  mfa_enabled: 'Two-Factor Authentication Enabled',
  mfa_disabled: 'Two-Factor Authentication Disabled',
  password_changed: 'Password Changed',
  password_reset: 'Password Reset',
  login_new_device: 'New Device Login Detected',
};

const EVENT_DESCRIPTIONS: Record<string, string> = {
  mfa_enabled: 'Two-factor authentication has been enabled on your account. Your account is now more secure.',
  mfa_disabled: 'Two-factor authentication has been disabled on your account. Consider re-enabling it for added security.',
  password_changed: 'Your admin password has been changed successfully.',
  password_reset: 'Your password has been reset. If you did not request this change, please secure your account immediately.',
  login_new_device: 'A new device or browser was used to sign in to your admin account.',
};

const EVENT_ICONS: Record<string, string> = {
  mfa_enabled: '🔒',
  mfa_disabled: '🔓',
  password_changed: '🔑',
  password_reset: '🔑',
  login_new_device: '💻',
};

export async function sendSecurityNotificationEmail(data: SecurityNotificationData) {
  const eventLabel = EVENT_LABELS[data.event] || 'Security Event';
  const eventDescription = EVENT_DESCRIPTIONS[data.event] || 'A security event occurred on your account.';
  const icon = EVENT_ICONS[data.event] || '⚠️';
  const timestamp = data.timestamp || new Date();

  const subject = `${icon} Security Alert: ${eventLabel} — Senza Luce Safaris`;

  const rows: [string, string][] = [
    ['Event', eventLabel],
    ['Time', timestamp.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })],
  ];
  if (data.ipAddress) rows.push(['IP Address', escapeHtml(data.ipAddress)]);
  if (data.userAgent) rows.push(['Browser', escapeHtml(data.userAgent.substring(0, 80))]);

  const html = `
    ${emailHeader({ subject, preheader: `${eventLabel} on your admin account` })}
    ${brandedHeader('Security Notification')}
    ${customerBlock(`
      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        Hi ${escapeHtml(data.adminName)},
      </p>

      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        ${eventDescription}
      </p>

      ${dataTable(rows)}

      ${data.event === 'password_reset' || data.event === 'login_new_device' ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fef2f2;border-left:4px solid #dc2626;border-radius:4px;padding:20px;margin-bottom:24px;">
        <tr>
          <td>
            <p style="margin:0;color:#333333;font-size:15px;line-height:1.6;">
              <strong>Did you make this change?</strong><br>
              If you did not ${data.event === 'password_reset' ? 'request a password reset' : 'log in from a new device'}, your account may be compromised. Please contact our support team immediately and change your password.
            </p>
          </td>
        </tr>
      </table>
      ` : ''}

      <p style="margin:0;color:#333333;font-size:16px;line-height:1.6;">
        If you have any concerns, please contact our support team.
      </p>
    `)}
    ${adminFooter()}
    ${emailFooter()}
  `;

  return sendEmail({
    to: data.adminEmail,
    subject,
    html,
  });
}
