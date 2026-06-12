const Booking =
  require("../models/Booking");

const Hotel =
  require("../models/Hotel");

const createBooking =
  async (req, res) => {
    try {
      const hotel =
        await Hotel.findById(
          req.body.hotelId
        );

      if (!hotel) {
        return res
          .status(404)
          .json({
            message:
              "Hotel not found",
          });
      }

      if (
        hotel.availableRooms <
        req.body.rooms
      ) {
        return res
          .status(400)
          .json({
            message: `Only ${hotel.availableRooms} room(s) available`,
          });
      }

      const booking =
        await Booking.create(
          req.body
        );

      hotel.availableRooms =
        hotel.availableRooms -
        req.body.rooms;

      await hotel.save();

      res.status(201).json({
        message:
          "Booking Created Successfully",
        booking,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const getUserBookings =
  async (req, res) => {
    try {
      const { userId } =
        req.params;

      const bookings =
        await Booking.find({
          userId,
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

const checkAvailability =
  async (req, res) => {
    try {
      const {
        hotelId,
        checkIn,
        checkOut,
      } = req.body;

      const hotel =
        await Hotel.findById(
          hotelId
        );

      if (!hotel) {
        return res
          .status(404)
          .json({
            message:
              "Hotel not found",
          });
      }

      const overlappingBookings =
        await Booking.find({
          hotelId,
          status:
            "Confirmed",
          checkIn: {
            $lt:
              new Date(
                checkOut
              ),
          },
          checkOut: {
            $gt:
              new Date(
                checkIn
              ),
          },
        });

      const bookedRooms =
        overlappingBookings.reduce(
          (
            total,
            booking
          ) =>
            total +
            booking.rooms,
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
        message:
          error.message,
      });
    }
  };

const cancelBooking =
  async (req, res) => {
    try {
      const booking =
        await Booking.findById(
          req.params.id
        );

      if (!booking) {
        return res
          .status(404)
          .json({
            message:
              "Booking not found",
          });
      }

      if (
        booking.status ===
        "Cancelled"
      ) {
        return res
          .status(400)
          .json({
            message:
              "Booking already cancelled",
          });
      }
      
      const hotel =
        await Hotel.findById(
          booking.hotelId
        );

      if (hotel) {
        hotel.availableRooms =
          hotel.availableRooms +
          booking.rooms;

        await hotel.save();
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