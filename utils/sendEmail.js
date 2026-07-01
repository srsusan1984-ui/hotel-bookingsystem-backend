const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("SMTP Error:", error);
  } else {
    console.log("✅ SMTP Server is ready");
  }
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: '"Hotel Booking System" <srsusan1984@gmail.com>',
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;