import { sendEmail } from './sender';
import {
  emailHeader,
  emailFooter,
  brandedHeader,
  brandedFooter,
  customerBlock,
  dataTable,
  infoBox,
  signature,
  escapeHtml,
  formatDate,
} from './templates';

interface TransferStatusData {
  referenceNumber: string;
  customerFirstName: string;
  customerEmail: string;
  transferType: string;
  pickupLocation: string;
  dropoffLocation: string;
  transferDate: Date;
  oldStatus: string;
  newStatus: string;
}

const TRANSFER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const TRANSFER_STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  confirmed: '#1a5632',
  completed: '#16a34a',
  cancelled: '#dc2626',
};

export async function sendTransferStatusUpdateEmail(data: TransferStatusData) {
  const statusLabel = TRANSFER_STATUS_LABELS[data.newStatus] || data.newStatus;
  const statusColor = TRANSFER_STATUS_COLORS[data.newStatus] || '#6b7280';

  const subject = `Transfer ${statusLabel} — Ref: ${data.referenceNumber} — Senza Luce Safaris`;

  const html = `
    ${emailHeader({ subject, preheader: `Your transfer ${data.referenceNumber} is now ${statusLabel}` })}
    ${brandedHeader('Transfer Status Update')}
    ${customerBlock(`
      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        Dear ${escapeHtml(data.customerFirstName)},
      </p>

      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        Your vehicle transfer request has been updated. Here are the details:
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff9e6;border-left:4px solid #f59e0b;border-radius:4px;padding:20px;margin-bottom:24px;">
        <tr>
          <td>
            <p style="margin:0;color:#333333;font-size:14px;">
              <strong>Reference Number:</strong><br>
              <span style="font-size:24px;font-weight:bold;color:#1a5632;font-family:monospace;">${escapeHtml(data.referenceNumber)}</span>
            </p>
          </td>
        </tr>
      </table>

      <h3 style="margin:0 0 16px 0;color:#1a5632;font-size:18px;font-weight:600;">Status Update</h3>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9;border-radius:6px;padding:24px;margin-bottom:24px;">
        <tr>
          <td>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:8px 0;color:#666666;font-size:14px;">Previous Status</td>
                <td style="padding:8px 0;font-size:14px;text-align:right;">
                  <span style="color:#666666;">${TRANSFER_STATUS_LABELS[data.oldStatus] || data.oldStatus}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#666666;font-size:14px;">New Status</td>
                <td style="padding:8px 0;font-size:14px;text-align:right;font-weight:600;">
                  <span style="color:${statusColor};font-size:16px;">${statusLabel}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <h3 style="margin:0 0 16px 0;color:#1a5632;font-size:18px;font-weight:600;">Transfer Details</h3>
      ${dataTable([
        ['Transfer Type', data.transferType],
        ['Pickup', data.pickupLocation],
        ['Dropoff', data.dropoffLocation],
        ['Date', formatDate(data.transferDate)],
      ])}

      ${data.newStatus === 'confirmed' ? `
      ${infoBox('Your transfer is confirmed!', 'Our driver will contact you on the day of transfer. Please ensure you are available at the pickup location at the scheduled time.')}
      ` : ''}

      ${data.newStatus === 'cancelled' ? `
      ${infoBox('Transfer cancelled', 'If you believe this was done in error, please contact us and we will be happy to assist you.', '#dc2626', '#fef2f2')}
      ` : ''}

      <p style="margin:0 0 24px 0;color:#333333;font-size:16px;line-height:1.6;">
        For questions, contact us and reference your number above.
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
