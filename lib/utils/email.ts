import nodemailer from 'nodemailer';

export async function sendInviteEmail(
  email: string,
  tempPassword: string,
  role: string,
  companyName?: string
) {
  // If SMTP is not configured, skip sending email
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn('SMTP not configured. Email not sent. Please configure SMTP_USER and SMTP_PASSWORD in .env.local');
    return { success: false, error: 'Email service not configured' };
  }

  // Create transporter with SMTP credentials
  // Remove any spaces from password (Gmail app passwords should be 16 characters, no spaces)
  const smtpPassword = (process.env.SMTP_PASSWORD || '').replace(/\s/g, '');
  const smtpUser = (process.env.SMTP_USER || '').trim();
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
    // Add debug logging for troubleshooting
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development',
  });

  const loginUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const appName = 'FreeloLedger';

  const mailOptions = {
    from: `"${appName}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `You've been invited to join ${companyName || appName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0B63FF 0%, #3B82F6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #0B63FF; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
          .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0B63FF; }
          .credentials p { margin: 8px 0; }
          .credentials strong { color: #0B63FF; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to ${appName}!</h1>
          </div>
          <div class="content">
            <h2>You've been invited to join ${companyName || 'our team'}!</h2>
            <p>Hello,</p>
            <p>You have been invited to join <strong>${companyName || appName}</strong> as a <strong>${role.charAt(0).toUpperCase() + role.slice(1)}</strong>.</p>
            
            <div class="credentials">
              <p><strong>Your Login Credentials:</strong></p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Temporary Password:</strong> ${tempPassword}</p>
            </div>

            <p><strong>⚠️ Important:</strong> Please change your password after your first login for security.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}/login" class="button">Login to ${appName}</a>
            </div>

            <p>If you have any questions, please contact your team administrator.</p>

            <p>Best regards,<br>The ${appName} Team</p>

            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to ${appName}!

You've been invited to join ${companyName || appName} as a ${role}.

Your Login Credentials:
Email: ${email}
Temporary Password: ${tempPassword}

⚠️ Important: Please change your password after your first login for security.

Login here: ${loginUrl}/login

If you have any questions, please contact your team administrator.

Best regards,
The ${appName} Team
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}
