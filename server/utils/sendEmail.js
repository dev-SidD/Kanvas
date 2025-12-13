// utils/sendEmail.js
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
  // Check if required environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    const error = new Error('Email configuration is missing. Please set EMAIL_USER and EMAIL_PASS environment variables.');
    console.error('Email configuration error:', error.message);
    throw error;
  }

  if (!process.env.FRONTEND_URL) {
    const error = new Error('FRONTEND_URL environment variable is not set.');
    console.error('Email configuration error:', error.message);
    throw error;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Add timeout settings to prevent hanging
      connectionTimeout: 10000, // 10 seconds
      socketTimeout: 10000, // 10 seconds
      greetingTimeout: 10000, // 10 seconds
    });

    // Use the environment variable for the URL
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const mailOptions = {
      from: `"Kanvas" <${process.env.EMAIL_USER}>`,
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

    // Send email with timeout (15 seconds)
    const sendPromise = transporter.sendMail(mailOptions);
    const info = await withTimeout(sendPromise, 15000);
    console.log("Email sent successfully! Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    console.error("Full error:", error);
    // Provide more specific error messages
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check your EMAIL_USER and EMAIL_PASS credentials.');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Failed to connect to email server. Please check your internet connection and email service settings.');
    } else {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
};

module.exports = sendVerificationEmail;