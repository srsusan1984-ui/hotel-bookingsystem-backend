const express =
  require("express");

const {
  addHotel,
  getHotels,
  getAgentHotels,
  updateHotel,
  deleteHotel,
  getHotelById,
} = require(
  "../controllers/hotelController"
);

const router =
  express.Router();

router.post(
  "/",
  addHotel
);

router.get(
  "/",
  getHotels
);

router.get(
  "/agent/:agentId",
  getAgentHotels
);

router.get(
  "/:id",
  getHotelById
);

router.put(
  "/:id",
  updateHotel
);

router.delete(
  "/:id",
  deleteHotel
);

module.exports =
  router;