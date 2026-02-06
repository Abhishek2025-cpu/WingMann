const mongoose = require('mongoose');

const notificationTokenSchema = new mongoose.Schema({
  userId: {
    type: String, // Agar tumhare paas User Model hai toh mongoose.Schema.Types.ObjectId use kar sakte ho
    required: true,
    unique: true // Ek user ka ek hi latest token save karenge
  },
  fcmToken: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('NotificationToken', notificationTokenSchema);