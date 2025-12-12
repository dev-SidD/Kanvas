const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  // ✅ Explicitly state Google's server
    port: 465,               // ✅ Use the secure port (SSL/TLS)
    secure: true,            // ✅ Must be true for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
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

  // This will throw an error if it fails, which your controller needs to catch
  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;