const express = require("express");
const reviewController = require("../controllers/reviewController");

const router = express.Router();

// User: Submit review
router.post("/submit", reviewController.submitReview);

// User: Get reviews for a hotel
router.get("/hotel/:hotelId", reviewController.getHotelReviews);

// User: Get reviews by user
router.get("/user/:userId", reviewController.getUserReviews);

// User: Get review statistics for a hotel
router.get("/stats/:hotelId", reviewController.getReviewStats);

// Admin: Get all pending reviews
router.get("/admin/pending", reviewController.getPendingReviews);

// Admin: Approve a review
router.put("/admin/approve/:reviewId", reviewController.approveReview);

// Admin: Delete a review
router.delete("/admin/delete/:reviewId", reviewController.deleteReview);

// Admin: Add response to review
router.put("/admin/response/:reviewId", reviewController.addAdminResponse);

module.exports = router;
