import { sendEmail } from '@/lib/email/sender';
import { sendSmtpEmail } from '@/lib/integrations/smtp';

jest.mock('@/lib/integrations/smtp', () => ({
  sendSmtpEmail: jest.fn(),
}));

jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: jest.fn().mockResolvedValue({ data: { id: 'mocked-resend-id' } }),
      },
    })),
  };
});

describe('Email Pipeline and Fallback', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should send via SMTP successfully when available', async () => {
    (sendSmtpEmail as jest.Mock).mockResolvedValue('smtp-success-id');

    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test</p>',
    });

    expect(result.success).toBe(true);
    expect(result.id).toBe('smtp-success-id');
    expect(sendSmtpEmail).toHaveBeenCalled();
  });

  it('should fall back to Resend when SMTP throws and RESEND_API_KEY is configured', async () => {
    process.env.RESEND_API_KEY = 're_test_key_12345';
    (sendSmtpEmail as jest.Mock).mockRejectedValue(new Error('SMTP connection failed'));

    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test</p>',
    });

    expect(result.success).toBe(true);
    expect(result.id).toBe('mocked-resend-id');
    expect(sendSmtpEmail).toHaveBeenCalled();
  });

  it('should return failure when both SMTP and Resend fail', async () => {
    process.env.RESEND_API_KEY = '';
    (sendSmtpEmail as jest.Mock).mockRejectedValue(new Error('SMTP connection failed'));

    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test</p>',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('SMTP connection failed');
  });
});
