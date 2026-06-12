const mongoose =
  require("mongoose");

const hotelSchema =
  new mongoose.Schema(
    {
      hotelName: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      image: {
        type: String,
        required: true,
      },

      totalRooms: {
        type: Number,
        required: true,
      },

      availableRooms: {
        type: Number,
        required: true,
      },

      agentId: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Agent",

        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Hotel",
    hotelSchema
  );