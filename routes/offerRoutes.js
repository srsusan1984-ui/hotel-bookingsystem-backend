const express = require("express");
const offerController = require("../controllers/offerController");

const router = express.Router();

// User: Get all active offers
router.get("/active", offerController.getActiveOffers);

// User: Validate promo code
router.post("/validate", offerController.validatePromoCode);

// Admin: Create offer
router.post("/create", offerController.createOffer);

// Admin: Get all offers
router.get("/all", offerController.getAllOffers);

// Admin: Get offer by ID
router.get("/:offerId", offerController.getOfferById);

// Admin: Update offer
router.put("/:offerId", offerController.updateOffer);

// Admin: Deactivate offer
router.delete("/:offerId", offerController.deactivateOffer);

// Admin: Increment usage count
router.post("/usage/increment", offerController.incrementUsageCount);


router.put(
  "/restore/:offerId",
  offerController.restoreOffer
);

module.exports = router;

