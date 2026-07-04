const nodemailer = require("nodemailer");

// Check environment variables
console.log("HOST:", process.env.SMTP_HOST);
console.log("PORT:", process.env.SMTP_PORT);
console.log("USER:", process.env.SMTP_USER);
console.log("PASS EXISTS:", !!process.env.SMTP_PASS);

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP connection when server starts
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP Error:", error);
  } else {
    console.log("✅ SMTP Server is ready");
  }
});

// Send Email Function
const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: '"Hotel Booking System" <srsusan1984@gmail.com>',
      to,
      subject,
      html,
    });

    console.log("========== EMAIL INFO ==========");
    console.log(info);
    console.log("================================");
  } catch (err) {
    console.error("❌ EMAIL FAILED");
    console.error(err);
    throw err;
  }
};

module.exports = sendEmail;