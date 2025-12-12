const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
  console.log("Email User:", process.env.EMAIL_USER); 
  console.log("Frontend URL:", process.env.FRONTEND_URL);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,              // ✅ Port 587 is standard for cloud hosting
    secure: false,          // ✅ Must be FALSE for port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Optional: accurate logging to see SMTP communication
    logger: true,
    debug: true
  });

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  console.log("Verification Link:", verificationUrl);

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
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId); // ✅ Log success ID
  } catch (error) {
    console.error("Error sending email:", error); // ✅ Log exact error
    throw error; // Throw so controller handles it
  }
};

module.exports = sendVerificationEmail;