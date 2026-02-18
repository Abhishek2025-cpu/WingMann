const mongoose = require("mongoose");

const userAvailabilitySchema = new mongoose.Schema(
  {
    userDataId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    timeSlots: [
      {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        isBooked: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserAvailability", userAvailabilitySchema);