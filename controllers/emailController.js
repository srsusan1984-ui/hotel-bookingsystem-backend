const nodemailer =
  require("nodemailer");

const sendBookingEmail =
  async (
    toEmail,
    hotelName
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

    await transporter.sendMail({
      from:
        process.env.EMAIL_USER,

      to: toEmail,

      subject:
        "Booking Confirmation",

      html: `
        <h2>Booking Confirmed 🎉</h2>
        <p>Your booking for <b>${hotelName}</b> has been confirmed.</p>
      `,
    });
  };

module.exports = {
  sendBookingEmail,
};