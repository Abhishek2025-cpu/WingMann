const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    userDataId: { type: mongoose.Schema.Types.ObjectId, ref: "UserData", required: true },
    interviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "Interviewer", required: true },
    slots: [
      {
        day: { type: String, required: true },
        time: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Overwrite-safe export to prevent OverwriteModelError
module.exports = mongoose.models.Interview || mongoose.model("Interview", interviewSchema);
