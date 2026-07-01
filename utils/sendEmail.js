const nodemailer =
  require("nodemailer");

const sendEmail = async (
  to,
  subject,
  html
) => {
  const transporter =
    nodemailer.createTransport({
      service: "gmail",
      auth: {
        user:
          process.env.EMAIL_USER,
        pass:
          process.env.EMAIL_PASS,
      },
    });
// 👇 Add it here
  transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP Error:", error);
    } else {
      console.log("SMTP Server is ready");
    }
  });
  await transporter.sendMail({
    from:
      process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};

module.exports =
  sendEmail;