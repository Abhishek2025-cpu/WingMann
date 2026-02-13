const express = require("express");
const { createFeedback, getFeedbackStats, getAllFeedbacks, getconditionBaseFeedbackStats } = require("../controllers/feedback.controller");
const { adminMiddleware } = require("../middlewares/adminMiddleware");
const router =express.Router();

router.post("/create", createFeedback);

router.get("/stats",  adminMiddleware, getFeedbackStats);

router.get("/all", adminMiddleware, getAllFeedbacks );

router.get("/condition-stats",adminMiddleware, getconditionBaseFeedbackStats)
module.exports = router;