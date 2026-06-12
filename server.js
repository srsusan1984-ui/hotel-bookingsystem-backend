const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const hotelRoutes =require("./routes/hotelRoutes");
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
  app.use(
  "/api/bookings",
  bookingRoutes
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