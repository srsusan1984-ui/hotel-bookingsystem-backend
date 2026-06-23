const Review = require("../models/Review");
const Hotel = require("../models/Hotel");
const User = require("../models/User");

// User: Submit a review
exports.submitReview = async (req, res) => {
  try {
    const { userId, hotelId, bookingId, rating, title, comment } = req.body;

    if (!userId || !hotelId || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const user = await User.findById(userId);
    const hotel = await Hotel.findById(hotelId);

    if (!user || !hotel) {
      return res.status(404).json({
        success: false,
        message: "User or Hotel not found",
      });
    }
const Booking = require("../models/Booking");

const booking = await Booking.findOne({
  userId,
  hotelId,
  status: "Confirmed"
});

if (!booking) {
  return res.status(403).json({
    success: false,
    message: "You can only review hotels you have booked",
  });
}
const existingReview = await Review.findOne({
  userId,
  hotelId,
});

if (existingReview) {
  return res.status(400).json({
    success: false,
    message: "You have already reviewed this hotel",
  });
}
    const review = new Review({
      userId,
      hotelId,
      bookingId: bookingId || null,
      rating,
      title,
      comment,
      userName: user.name,
      hotelName: hotel.hotelName,
      isApproved: true,
    });

    await review.save();

    return res.status(201).json({
      success: true,
      message: "Your review has been posted and is now visible to other guests",
      review,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error submitting review",
      error: error.message,
    });
  }
};

// User: Get reviews for a hotel
exports.getHotelReviews = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const reviews = await Review.find({
      hotelId,
      isApproved: true,
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1)
        : 0;

    return res.status(200).json({
      success: true,
      totalReviews,
      averageRating,
      reviews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};

// User: Get all reviews by a user
exports.getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ userId })
      .populate("hotelId", "hotelName city")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user reviews",
      error: error.message,
    });
  }
};

// Admin: Get all pending reviews
exports.getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: false })
      .populate("userId", "name email")
      .populate("hotelId", "hotelName")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching pending reviews",
      error: error.message,
    });
  }
};

// Admin: Approve a review
exports.approveReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { isApproved: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review approved successfully",
      review,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error approving review",
      error: error.message,
    });
  }
};

// Admin: Reject/Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message,
    });
  }
};

// Admin: Add response to a review
exports.addAdminResponse = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { response } = req.body;

    if (!response) {
      return res.status(400).json({
        success: false,
        message: "Response is required",
      });
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { adminResponse: response },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Response added successfully",
      review,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error adding response",
      error: error.message,
    });
  }
};

// Get reviews with statistics
exports.getReviewStats = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const reviews = await Review.find({
      hotelId,
      isApproved: true,
    });

    const stats = {
      totalReviews: reviews.length,
      averageRating:
      reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0,
      ratingDistribution: {
        5: reviews.filter((r) => r.rating === 5).length,
        4: reviews.filter((r) => r.rating === 4).length,
        3: reviews.filter((r) => r.rating === 3).length,
        2: reviews.filter((r) => r.rating === 2).length,
        1: reviews.filter((r) => r.rating === 1).length,
      },
    };

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching review stats",
      error: error.message,
    });
  }
};
