const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { createDateRequest, getDateRequestsForReceiver } = require("../controllers/dateRequestController");
const router = express.Router();

router.post("/create", protect, createDateRequest);

router.get("/reciever/:id", protect, getDateRequestsForReceiver);

module.exports = router;