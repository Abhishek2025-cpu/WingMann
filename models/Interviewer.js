const mongoose = require("mongoose");

const interviewerSchema = new mongoose.Schema(
  {
    // --- Existing fields (unchanged) ---
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "India" },
    address: { type: String, default: "" },
    pincode: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female", "other"], default: "male" },
    dob: { type: Date },
    designation: { type: String, default: "" },
    experience: { type: Number, default: 0 },
    skills: [{ type: String }],
    profilePhotos: [{ type: String, default: [] }],
    resume: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },

    // --- NEW FIELD FOR SLOT MANAGEMENT ---
    availableSlots: [
      {
        day: { type: String, required: true },
        time: { type: String, required: true },
        isBooked: { type: Boolean, default: false }, // true if slot is assigned
      },
    ],
  },
  { timestamps: true }
);

// --- Overwrite-safe export (fixes OverwriteModelError) ---
module.exports = mongoose.models.Interviewer || mongoose.model("Interviewer", interviewerSchema);
