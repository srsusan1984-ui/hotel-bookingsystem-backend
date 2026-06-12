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

module.exports = {
  
  addHotel,
  getHotels,
  getAgentHotels,
  updateHotel,
  deleteHotel,
  getHotelById,
};