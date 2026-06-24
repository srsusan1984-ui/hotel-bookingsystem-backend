const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const hotelRoutes =require("./routes/hotelRoutes");
const paymentRoutes =require("./routes/PaymentRoutes");
dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use(
  "/api/hotels",
  hotelRoutes
);
const bookingRoutes =
  require(
    "./routes/bookingRoutes"
  );
const reviewRoutes = require(
  "./routes/reviewRoutes"
);
const offerRoutes = require(
  "./routes/offerRoutes"
);

app.use(
  "/api/bookings",
  bookingRoutes
);
app.use(
  "/api/reviews",
  reviewRoutes
);
app.use(
  "/api/payment",
  paymentRoutes
);
app.use(
  "/api/offers",
  offerRoutes
);

app.get("/", (req, res) => {
  res.send("Backend Running...");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});