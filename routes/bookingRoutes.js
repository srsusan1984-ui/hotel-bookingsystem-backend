const express =
  require("express");

const {
  createBooking,
  getUserBookings,
  cancelBooking,
  checkAvailability,
  getBookingsByHotel,
} = require(
  "../controllers/BookingController"
);

const router =
  express.Router();

router.post(
  "/",
  createBooking
);


router.post(
  "/availability",
  checkAvailability
);

router.get(
  "/user/:userId",
  getUserBookings
);
router.get(
  "/hotel/:hotelId",
  getBookingsByHotel
);
router.put(
  "/cancel/:id",
  cancelBooking
);

module.exports =
  router;