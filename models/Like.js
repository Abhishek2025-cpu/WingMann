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

    isLike: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ✅ Prevent duplicate like for same sender -> same user
likeSchema.index({ senderId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);
