// controllers/paymentController.js
require("dotenv").config();
const Razorpay = require("razorpay");
console.log(
  "KEY:",
  process.env.RAZORPAY_KEY_ID
);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret:
    process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (
  req,
  res
) => {
  try {
    const { amount } = req.body;

    const order =
      await razorpay.orders.create({
        amount: amount * 100,
        currency: "INR",
      });

    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createOrder,
};