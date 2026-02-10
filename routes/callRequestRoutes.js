const express = require("express");
const { createCallRequest, getRequestsForReceiver } = require("../controllers/callRequestController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create", createCallRequest, protect);

router.get("/reciever/:id", protect, getRequestsForReceiver);

module.exports = router;