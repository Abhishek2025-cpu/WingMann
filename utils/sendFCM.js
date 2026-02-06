const admin = require("firebase-admin");
const NotificationToken = require("../models/NotificationToken");

module.exports = async (userId, data) => {
  const tokenDoc = await NotificationToken.findOne({ userId });
  if (!tokenDoc) return;

  await admin.messaging().send({
    token: tokenDoc.fcmToken,
    notification: {
      title: data.title,
      body: data.body
    },
    data: data.data || {}
  });
};
