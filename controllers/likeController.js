const Like = require("../models/Like");

exports.likeUnlikeUser = async (req, res) => {
  try {
    const { senderId, userId, isLike } = req.body;

    if (!senderId || !userId) {
      return res.status(400).json({
        success: false,
        message: "senderId and userId are required",
      });
    }

    if (senderId === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot like yourself",
      });
    }

    // if isLike not provided, default true
    const finalIsLike = typeof isLike === "boolean" ? isLike : true;

    // ✅ find existing like record
    const existing = await Like.findOne({ senderId, userId });

    // -----------------------------
    // CASE 1: Like = true
    // -----------------------------
    if (finalIsLike === true) {
      if (existing) {
        existing.isLike = true;
        await existing.save();

        return res.status(200).json({
          success: true,
          message: "User liked successfully",
          data: existing,
        });
      }

      const newLike = await Like.create({
        senderId,
        userId,
        isLike: true,
      });

      return res.status(201).json({
        success: true,
        message: "User liked successfully",
        data: newLike,
      });
    }

    // -----------------------------
    // CASE 2: Like = false (Unlike)
    // -----------------------------
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Like record not found",
      });
    }

    existing.isLike = false;
    await existing.save();

    return res.status(200).json({
      success: true,
      message: "User unliked successfully",
      data: existing,
    });
  } catch (error) {
    console.log(error, error.message);
    // duplicate key case
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You already liked this user",
      });
    }

    res.status(500).json({

        
      success: false,
      message: error.message,
    });
  }
};


exports.getLikesForUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const likes = await Like.find({ userId, isLike: true })
      .populate("senderId", "name gender images")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: likes.length,
      data: likes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyLikedUsers = async (req, res) => {
  try {
    const senderId = req.params.senderId;

    const likedUsers = await Like.find({ senderId, isLike: true })
      .populate("userId", "name gender images")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: likedUsers.length,
      data: likedUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
