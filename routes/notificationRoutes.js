const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// POST method for saving token
router.post('/save-token', notificationController.saveFCMToken);

module.exports = router;