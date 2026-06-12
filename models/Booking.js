const mongoose =
  require("mongoose");

const bookingSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "User",
        required: true,
      },

      hotelId: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Hotel",
        required: true,
      },

      hotelName: {
        type: String,
        required: true,
      },

      checkIn: {
        type: Date,
        required: true,
      },

      checkOut: {
        type: Date,
        required: true,
      },

      adults: {
        type: Number,
        default: 1,
      },

      children: {
        type: Number,
        default: 0,
      },

      rooms: {
        type: Number,
        default: 1,
      },

      guests: [
        {
          name: String,
          age: Number,
          gender: String,
        },
      ],

      totalAmount: {
        type: Number,
        required: true,
      },

      status: {
        type: String,
        default:
          "Confirmed",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Booking",
    bookingSchema
  );


  //booking.js 

  