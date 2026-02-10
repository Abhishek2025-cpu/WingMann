const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
      required: true,
    },

    // ✅ Like / Dislike (no default)
    isLike: {
      type: Boolean,
      default: null,
    },
  },
  { timestamps: true }
);

likeSchema.index({ senderId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);
