const NotificationToken = require('../models/NotificationToken');

exports.saveFCMToken = async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;

    if (!userId || !fcmToken) {
      return res.status(400).json({
        success: false,
        message: "userId and fcmToken are required"
      });
    }

    // Upsert Logic: Agar userId exists karti hai toh update karo, nahi toh create karo
    const updatedToken = await NotificationToken.findOneAndUpdate(
      { userId: userId },
      { fcmToken: fcmToken },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "FCM Token saved successfully",
      data: updatedToken
    });
  } catch (error) {
    console.error("Error saving FCM Token:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};