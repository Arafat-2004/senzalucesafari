import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables immediately on startup
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testCategory(category: 'auth' | 'bookings' | 'contact' | 'support' | 'general', recipient: string, name: string) {
  const { sendEmail, getSenderString } = await import('../src/lib/email/sender');
  
  console.log(`\n--- TESTING CATEGORY: ${category.toUpperCase()} ---`);
  const senderStr = getSenderString(category);
  console.log(`Resolved Sender: ${senderStr}`);
  
  const subject = `Test Email: [${category.toUpperCase()}] Sender Verification`;
  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; padding: 30px; color: #333;">
        <h2>Sender Verification: ${category.toUpperCase()}</h2>
        <p>This is a test email verifying that the category <strong>${category}</strong> correctly routes outgoing mail.</p>
        <p>Sender header used: <code>${senderStr}</code></p>
      </body>
    </html>
  `;
  
  const result = await sendEmail({ to: recipient, subject, html, category });
  if (result.success) {
    console.log(`SUCCESS: [${category}] Sent successfully! Message ID: ${result.id}`);
  } else {
    console.error(`ERROR: [${category}] Failed to send. Reason: ${result.error}`);
  }
}

async function run() {
  // Dynamically import libraries
  const { prisma } = await import('../src/lib/prisma');

  let testRecipient = process.env.ADMIN_EMAIL || 'arafatmbaga@gmail.com';
  let recipientName = 'Administrator';

  try {
    const booking = await prisma.booking.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { email: true, firstName: true, lastName: true }
    });

    if (booking && booking.email) {
      testRecipient = booking.email;
      recipientName = `${booking.firstName || ''} ${booking.lastName || ''}`.trim() || 'Valued Customer';
      console.log(`Found database customer to send test notifications: ${recipientName} <${testRecipient}>`);
    }
  } catch (dbError) {
    console.warn('Database query skipped (using default recipient):', dbError instanceof Error ? dbError.message : String(dbError));
  }

  // Run tests across different email categories
  await testCategory('bookings', testRecipient, recipientName);
  await testCategory('contact', testRecipient, recipientName);
  await testCategory('general', testRecipient, recipientName);
}

run().catch((err) => {
  console.error('Unhandled run error:', err);
});
