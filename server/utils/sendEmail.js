// utils/sendEmail.js
// EMAIL VERIFICATION UTILITY - CURRENTLY DISABLED
// This file is configured for Gmail SMTP. To re-enable email verification:
// 1. Uncomment the sendVerificationEmail import in authController.js
// 2. Update the registration and login logic in authController.js
// 3. Set up Gmail App Password in environment variables:
//    - EMAIL_USER=your-email@gmail.com
//    - EMAIL_PASS=your-app-password (not your regular password)
// 4. Set FRONTEND_URL environment variable
// 
// For Gmail setup:
// - Enable 2-Step Verification in Google Account
// - Generate App Password: https://myaccount.google.com/apppasswords
// - Use the 16-character app password (not your regular password)

const nodemailer = require('nodemailer');

// Helper function to add timeout to promises
const withTimeout = (promise, timeoutMs) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

const sendVerificationEmail = async (email, token) => {
  // Check if email is disabled (for development)
  if (process.env.EMAIL_DISABLED === 'true') {
    console.log('Email sending is disabled. Skipping verification email.');
    return { messageId: 'disabled' };
  }

  if (!process.env.FRONTEND_URL) {
    const error = new Error('FRONTEND_URL environment variable is not set.');
    console.error('Email configuration error:', error.message);
    throw error;
  }

  // Use the environment variable for the URL
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"Kanvas" <${process.env.EMAIL_USER || 'noreply@kanvas.com'}>`,
    to: email,
    subject: 'Please verify your email address',
    html: `
      <h2>Thank you for registering with Kanvas!</h2>
      <p>Please click the link below to verify your email address and activate your account:</p>
      <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>Or copy and paste this link in your browser:</p>
      <p>${verificationUrl}</p>
    `,
  };

  let transporter;

  // Support multiple email providers
  // Priority: SendGrid > Gmail > Custom SMTP
  if (process.env.SENDGRID_API_KEY) {
    // Use SendGrid (better for cloud platforms like Render)
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      // Determine the "from" email address
      // Priority: EMAIL_FROM > SENDGRID_FROM_EMAIL > default
      const fromEmail = process.env.EMAIL_FROM || process.env.SENDGRID_FROM_EMAIL;
      if (!fromEmail) {
        throw new Error('SENDGRID_FROM_EMAIL or EMAIL_FROM environment variable must be set. This should be your verified sender email in SendGrid.');
      }
      
      const msg = {
        to: email,
        from: fromEmail, // Must be a verified sender in SendGrid
        subject: mailOptions.subject,
        html: mailOptions.html,
      };
      
      const sendPromise = sgMail.send(msg);
      const info = await withTimeout(sendPromise, 15000);
      console.log("Email sent successfully via SendGrid!");
      return info;
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        console.error('@sendgrid/mail package not found. Install it with: npm install @sendgrid/mail');
        console.error('Falling back to SMTP...');
        // Fall through to SMTP method
      } else {
        console.error("SendGrid error:", error.message);
        throw new Error(`Failed to send email via SendGrid: ${error.message}`);
      }
    }
  }
  
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Use Gmail or custom SMTP
    try {
      // Check if custom SMTP settings are provided
      if (process.env.SMTP_HOST) {
        transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          connectionTimeout: 8000,
          socketTimeout: 8000,
          greetingTimeout: 8000,
        });
      } else {
        // Default to Gmail
        transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          connectionTimeout: 8000,
          socketTimeout: 8000,
          greetingTimeout: 8000,
        });
      }

      // Send email with timeout (12 seconds)
      const sendPromise = transporter.sendMail(mailOptions);
      const info = await withTimeout(sendPromise, 12000);
      console.log("Email sent successfully! Message ID:", info.messageId);
      return info;
    } catch (error) {
      console.error("Error sending email:", error.message);
      console.error("Full error:", error);
      
      // Provide more specific error messages
      if (error.code === 'EAUTH') {
        throw new Error('Email authentication failed. Please check your EMAIL_USER and EMAIL_PASS credentials.');
      } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
        throw new Error('Failed to connect to email server. This might be due to network restrictions. Consider using SendGrid or another cloud email service.');
      } else {
        throw new Error(`Failed to send email: ${error.message}`);
      }
    }
  } else {
    // No email configuration - log warning but don't throw error
    console.warn('Email configuration missing. Set SENDGRID_API_KEY or EMAIL_USER/EMAIL_PASS to enable email sending.');
    console.warn('Verification URL for manual testing:', verificationUrl);
    return { messageId: 'not-configured' };
  }
};

module.exports = sendVerificationEmail;