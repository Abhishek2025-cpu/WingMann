const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema(
  {
    startTime: { type: String, required: true }, // "10:00"
    endTime: { type: String, required: true },   // "11:00"
    isBooked: { type: Boolean, default: false },
  },
  { _id: false }
);

const interviewerAvailabilitySchema = new mongoose.Schema(
  {
    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interviewer",
      required: true,
    },

    // ✅ calendar date store as string (timezone bug free)
    date: {
      type: String,
      required: true,
      trim: true, // "2026-02-10"
    },

    timeSlots: {
      type: [timeSlotSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// ✅ one interviewer can set availability only once per date
interviewerAvailabilitySchema.index(
  { interviewerId: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "InterviewerAvailability",
  interviewerAvailabilitySchema
);
