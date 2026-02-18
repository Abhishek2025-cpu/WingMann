const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema(
  {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
  },
  { _id: true } // ✅ IMPORTANT (delete needs slotId)
);

const interviewerAvailabilitySchema = new mongoose.Schema(
  {
    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interviewer",
      required: true,
    },

    day: {
      type: String, // "Monday", "Tuesday", etc.
      required: true,
      trim: true,
    },

    timeSlots: {
      type: [timeSlotSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// ✅ One interviewer + one day key (weekly schedule)
interviewerAvailabilitySchema.index(
  { interviewerId: 1, day: 1 },
  { unique: true }
);

module.exports = mongoose.model("InterviewerAvailability", interviewerAvailabilitySchema);
