const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema(
  {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
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

    // ✅ NEW FIELD
     userDataId: { // ✅ ADD THIS
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserData"
  },

    date: {
      type: String,
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

// ✅ unique: one interviewer + userData + date
interviewerAvailabilitySchema.index(
  { interviewerId: 1, userDataId: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "InterviewerAvailability",
  interviewerAvailabilitySchema
);
