const Offer = require("../models/Offer");

// Admin: Create a new offer
exports.createOffer = async (req, res) => {
  try {
    const {
      code,
      title,
      description,
      discountType,
      discountValue,
      minBookingAmount,
      maxDiscount,
      validFrom,
      validUntil,
      maxUsageCount,
      applicableHotels,
      banner,
    } = req.body;

    if (
      !code ||
      !title ||
      !description ||
      !discountType ||
      !discountValue ||
      !validFrom ||
      !validUntil
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Check if code already exists
    const existingOffer = await Offer.findOne({ code: code.toUpperCase() });
    if (existingOffer) {
      return res.status(400).json({
        success: false,
        message: "Offer code already exists",
      });
    }

    const offer = new Offer({
      code: code.toUpperCase(),
      title,
      description,
      discountType,
      discountValue,
      minBookingAmount: minBookingAmount || 0,
      maxDiscount: maxDiscount || null,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      maxUsageCount: maxUsageCount || null,
      applicableHotels: applicableHotels
  ? Array.isArray(applicableHotels)
    ? applicableHotels
    : [applicableHotels]
  : [],
  banner: banner || null,
      isActive: true,
    });

    await offer.save();

    return res.status(201).json({
      success: true,
      message: "Offer created successfully",
      offer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error creating offer",
      error: error.message,
    });
  }
};

// User: Get all active offers
exports.getActiveOffers = async (req, res) => {
  try {
    const now = new Date();

    const offers = await Offer.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now },
    })
      .populate("applicableHotels", "hotelName city")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      offers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching offers",
      error: error.message,
    });
  }
};

// User: Validate and apply a promo code
exports.validatePromoCode = async (req, res) => {
  try {
    const { code, bookingAmount, hotelId } = req.body;

    if (!code || !bookingAmount) {
      return res.status(400).json({
        success: false,
        message: "Code and booking amount are required",
      });
    }

    const offer = await Offer.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired promo code",
      });
    }

    const now = new Date();
    if (offer.validFrom > now || offer.validUntil < now) {
      return res.status(400).json({
        success: false,
        message: "Promo code is not valid for the current date",
      });
    }

    if (offer.maxUsageCount && offer.usedCount >= offer.maxUsageCount) {
      return res.status(400).json({
        success: false,
        message: "Promo code has reached maximum usage limit",
      });
    }

    if (bookingAmount < offer.minBookingAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum booking amount of ₹${offer.minBookingAmount} required`,
      });
    }

    // Check if offer applies to this hotel
    if (
  offer.applicableHotels.length > 0 &&
  !offer.applicableHotels.some(
    (id) => id.toString() === hotelId
  )
) {
      return res.status(400).json({
        success: false,
        message: "This promo code is not applicable to the selected hotel",
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (offer.discountType === "percentage") {
      discountAmount = (bookingAmount * offer.discountValue) / 100;
      if (offer.maxDiscount && discountAmount > offer.maxDiscount) {
        discountAmount = offer.maxDiscount;
      }
    } else {
      discountAmount = offer.discountValue;
    }

    const finalAmount = bookingAmount - discountAmount;

    return res.status(200).json({
      success: true,
      message: "Promo code is valid",
      offer: {
        code: offer.code,
        title: offer.title,
        description: offer.description,
      },
      discount: {
        type: offer.discountType,
        value: offer.discountValue,
        amount: discountAmount,
      },
      finalAmount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error validating promo code",
      error: error.message,
    });
  }
};

// Admin: Get all offers
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find()
      .populate("applicableHotels", "hotelName city")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: offers.length,
      offers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching offers",
      error: error.message,
    });
  }
};

// Admin: Update an offer
exports.updateOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const updateData = req.body;

    // Don't allow changing the code
    delete updateData.code;

    const offer = await Offer.findByIdAndUpdate(offerId, updateData, {
      new: true,
    }).populate("applicableHotels", "hotelName city");

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer updated successfully",
      offer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error updating offer",
      error: error.message,
    });
  }
};

// Admin: Deactivate an offer
exports.deactivateOffer = async (req, res) => {
  try {
    const { offerId } = req.params;

    const offer = await Offer.findByIdAndUpdate(
      offerId,
      { isActive: false },
      { new: true }
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer deactivated successfully",
      offer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error deactivating offer",
      error: error.message,
    });
  }
};
exports.restoreOffer = async (req, res) => {
  try {
    const { offerId } = req.params;

    const offer = await Offer.findByIdAndUpdate(
      offerId,
      { isActive: true },
      { new: true }
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer restored successfully",
      offer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Admin: Increment usage count
exports.incrementUsageCount = async (req, res) => {
  try {
    const { code } = req.body;

    const offer = await Offer.findOneAndUpdate(
      { code: code.toUpperCase() },
      { $inc: { usedCount: 1 } },
      { new: true }
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Usage count updated",
      offer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error updating usage count",
      error: error.message,
    });
  }
};

// Get offer by ID
exports.getOfferById = async (req, res) => {
  try {
    const { offerId } = req.params;

    const offer = await Offer.findById(offerId).populate(
      "applicableHotels",
      "hotelName city"
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    return res.status(200).json({
      success: true,
      offer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching offer",
      error: error.message,
    });
  }
};
