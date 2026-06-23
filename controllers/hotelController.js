const Hotel =
  require("../models/Hotel");

const addHotel =

  async (req, res) => {
    try {
      const hotel =
        await Hotel.create({
          ...req.body,

          availableRooms:
            req.body.totalRooms,
        });
         
      res.status(201).json({
        message:
          "Hotel Added Successfully",
        hotel,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const getHotels =
  async (req, res) => {
    try {
      const hotels =
        await Hotel.find();

      res.status(200).json(
        hotels
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const getAgentHotels =
  async (req, res) => {
    try {
      const { agentId } =
        req.params;

      const hotels =
        await Hotel.find({
          agentId,
        });

      res.status(200).json(
        hotels
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const updateHotel =
  async (req, res) => {
    try {
      const hotel =
        await Hotel.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      res.status(200).json(
        hotel
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const deleteHotel =
  async (req, res) => {
    try {
      await Hotel.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        message:
          "Hotel Deleted Successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const getHotelById =
  async (req, res) => {
    try {
      const hotel =
        await Hotel.findById(
          req.params.id
        );

      res.status(200).json(
        hotel
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const getAvailability = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { checkInDate, checkOutDate } = req.query;

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "checkInDate and checkOutDate are required",
      });
    }

    // Parse dates properly - handle both ISO strings and date objects
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: "Check-in date must be before check-out date",
      });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    const Booking = require("../models/Booking");
    
    // Find overlapping bookings using date range comparison
    const bookedRooms = await Booking.find({
      hotelId: hotelId,
      status: { $in: ["Confirmed", "checked-in", "pending"] },
      checkIn: { $lt: new Date(endDate) },
      checkOut: { $gt: new Date(startDate) },
    });

    console.log(`[DEBUG] Hotel: ${hotel.hotelName}, Total Rooms: ${hotel.totalRooms}, Booked: ${bookedRooms.length}`);

    const totalBooked = bookedRooms.reduce((sum, b) => sum + (b.rooms || 1), 0);
    const available = Math.max(0, hotel.totalRooms - totalBooked);

    res.json({
      success: true,
      data: {
        hotelId,
        checkInDate,
        checkOutDate,
        totalRooms: hotel.totalRooms,
        bookedRooms: totalBooked,
        availableRooms: available,
      },
    });
  } catch (error) {
    console.error("[ERROR] getAvailability:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching availability",
      error: error.message,
    });
  }
};

module.exports = {
  
  addHotel,
  getHotels,
  getAgentHotels,
  updateHotel,
  deleteHotel,
  getHotelById,
  getAvailability,
};