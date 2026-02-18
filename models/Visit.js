const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
      required: true,
      unique: true,
    },
    visited: {
      type: Boolean,
      default: true,
    },
    visitedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visit", visitSchema);
