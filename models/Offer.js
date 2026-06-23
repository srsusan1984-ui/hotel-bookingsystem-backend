const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
    },
    createdByAgent: {
     type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
    default: null,
    },

    description: {
      type: String,
      required: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    minBookingAmount: {
      type: Number,
      default: 0,
    },

    maxDiscount: {
      type: Number,
      default: null,
    },

    validFrom: {
      type: Date,
      required: true,
    },

    validUntil: {
      type: Date,
      required: true,
    },

    maxUsageCount: {
      type: Number,
      default: null,
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    applicableHotels: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Hotel",
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    banner: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Offer", offerSchema);
