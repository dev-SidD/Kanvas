const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
  // Debug logs to confirm env vars are loading
  console.log("Email User:", process.env.EMAIL_USER); 
  console.log("Frontend URL:", process.env.FRONTEND_URL);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,              // ✅ Port 587 is the standard for cloud servers
    secure: false,          // ✅ CRITICAL FIX: Must be FALSE for Port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false // Helps avoid some certificate errors on cloud
    }
  });

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"Kanvas" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Please verify your email address',
    html: `
      <h2>Thank you for registering with Kanvas!</h2>
      <p>Please click the link below to verify your email address and activate your account:</p>
      <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
    `,
  };

  console.log("sending..");
  
  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully! Message ID:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Important: Lets the controller know it failed
  }
};

module.exports = sendVerificationEmail;