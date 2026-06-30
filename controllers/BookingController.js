const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// ========================= CREATE BOOKING =========================

const createBooking = async (req, res) => {
  try {
    console.log("========== CREATE BOOKING ==========");
    console.log(req.body);

    const {
      userId,
      hotelId,
      hotelName,
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
      guests,
      totalAmount,
      paymentId,
      userEmail,
    } = req.body;

    // Validation
    if (
      !userId ||
      !hotelId ||
      !hotelName ||
      !checkIn ||
      !checkOut ||
      !totalAmount
    ) {
      return res.status(400).json({
        message: "Missing required booking fields",
      });
    }

    // Check Hotel
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    // Check User
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check room availability
    const overlappingBookings = await Booking.find({
      hotelId,
      status: "Confirmed",
      checkIn: {
        $lt: new Date(checkOut),
      },
      checkOut: {
        $gt: new Date(checkIn),
      },
    });

    const bookedRooms = overlappingBookings.reduce(
      (total, booking) => total + booking.rooms,
      0
    );

    const availableRooms = hotel.totalRooms - bookedRooms;

    if (availableRooms < rooms) {
      return res.status(400).json({
        message: "Rooms are no longer available.",
      });
    }

    // Create Booking
    const booking = await Booking.create({
      userId,
      hotelId,
      hotelName,
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
      guests,
      totalAmount,
      status: "Confirmed",
      paymentId,
    });

    console.log("Booking Saved:", booking._id);

    // Send Email
    try {
      await sendEmail(
        userEmail || user.email,
        "Hotel Booking Confirmation",
        `
          <h2>Booking Confirmed 🎉</h2>

          <p>Hello <b>${user.name}</b>,</p>

          <p>Your booking has been confirmed.</p>

          <hr/>

          <p><b>Hotel:</b> ${hotelName}</p>

          <p><b>Check In:</b> ${new Date(checkIn).toDateString()}</p>

          <p><b>Check Out:</b> ${new Date(checkOut).toDateString()}</p>

          <p><b>Rooms:</b> ${rooms}</p>

          <p><b>Total Amount:</b> ₹${totalAmount}</p>

          <p><b>Booking ID:</b> ${booking._id}</p>

          <hr/>

          <p>Thank you for booking with us ❤️</p>
        `
      );

      console.log("Email Sent");
    } catch (emailError) {
      console.log("Email Error:", emailError.message);
    }

    return res.status(201).json({
      message: "Booking Confirmed Successfully",
      booking,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ========================= USER BOOKINGS =========================

const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================= CHECK AVAILABILITY =========================

const checkAvailability = async (req, res) => {
  try {
    const {
      hotelId,
      checkIn,
      checkOut,
    } = req.body;

    const hotel =
      await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    const overlappingBookings =
      await Booking.find({
        hotelId,
        status: "Confirmed",
        checkIn: {
          $lt: new Date(checkOut),
        },
        checkOut: {
          $gt: new Date(checkIn),
        },
      });

    const bookedRooms =
      overlappingBookings.reduce(
        (total, booking) =>
          total + booking.rooms,
        0
      );

    const availableRooms =
      hotel.totalRooms -
      bookedRooms;

    res.status(200).json({
      availableRooms,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================= CANCEL BOOKING =========================

const cancelBooking =
  async (req, res) => {
    try {
      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      booking.status =
        "Cancelled";

      await booking.save();

      res.status(200).json({
        message:
          "Booking Cancelled Successfully",
        booking,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ========================= HOTEL BOOKINGS =========================

const getBookingsByHotel =
  async (req, res) => {
    try {
      const { hotelId } =
        req.params;

      const bookings =
        await Booking.find({
          hotelId,
        });

      res.status(200).json(
        bookings
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking,
  checkAvailability,
  getBookingsByHotel,
};