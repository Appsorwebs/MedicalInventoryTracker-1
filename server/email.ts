import nodemailer from 'nodemailer';
import { Drug } from '@shared/schema';

// Check if SMTP configuration is available
const isSmtpConfigured = !!(
  process.env.SMTP_HOST && 
  process.env.SMTP_PORT && 
  process.env.SMTP_USER && 
  process.env.SMTP_PASS
);

// Create a transporter if SMTP is configured, otherwise set to null
const transporter = isSmtpConfigured 
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

// Verify transporter configuration if available
if (transporter) {
  transporter.verify(function (error, success) {
    if (error) {
      console.error('SMTP configuration error:', error);
    } else {
      console.log("SMTP server is ready to take our messages");
    }
  });
} else {
  console.warn('SMTP not configured. Email notifications will be disabled.');
}

interface EmailConfig {
  fromEmail: string;
  fromName: string;
}

const emailConfig: EmailConfig = {
  fromEmail: process.env.SMTP_USER || 'notifications@drugmanager.com',
  fromName: 'Drug Expiry Manager',
};

export async function sendExpirationAlert(
  userEmail: string,
  expiringDrugs: Drug[]
): Promise<boolean> {
  if (!userEmail) {
    console.error('Cannot send email: user email is empty');
    return false;
  }

  // If SMTP is not configured, log a message and return false
  if (!transporter || !isSmtpConfigured) {
    console.warn('Cannot send email: SMTP not configured');
    return false;
  }

  try {
    const emailContent = generateExpirationEmailContent(expiringDrugs);

    await transporter.sendMail({
      from: `"${emailConfig.fromName}" <${emailConfig.fromEmail}>`,
      to: userEmail,
      subject: 'Drug Expiration Alert',
      html: emailContent,
    });

    return true;
  } catch (error) {
    console.error('Failed to send expiration alert:', error);
    return false;
  }
}

function generateExpirationEmailContent(drugs: Drug[]): string {
  const today = new Date();

  const drugsList = drugs
    .map(drug => {
      const expiryDate = new Date(drug.expirationDate);
      const daysUntilExpiry = Math.ceil(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${drug.brandName}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${drug.batchNumber}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${expiryDate.toLocaleDateString()}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${daysUntilExpiry} days</td>
        </tr>
      `;
    })
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Drug Expiration Alert</h2>
      <p>The following drugs are approaching their expiration date:</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 10px; text-align: left;">Drug Name</th>
            <th style="padding: 10px; text-align: left;">Batch Number</th>
            <th style="padding: 10px; text-align: left;">Expiry Date</th>
            <th style="padding: 10px; text-align: left;">Days Until Expiry</th>
          </tr>
        </thead>
        <tbody>
          ${drugsList}
        </tbody>
      </table>

      <p style="margin-top: 20px;">
        Please take necessary action to manage these medications before they expire.
      </p>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
        This is an automated notification from your Drug Expiry Management System.
      </div>
    </div>
  `;
}