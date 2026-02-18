const mongoose = require("mongoose");

const visitSummarySchema = new mongoose.Schema(
  {
    totalUniqueVisitors: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VisitSummary", visitSummarySchema);
