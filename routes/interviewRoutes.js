const express = require("express");
const router = express.Router();
const interviewController = require("../controllers/interviewController");

// POST /api/interview/create
router.post("/create", interviewController.createInterview);
router.get("/summary",interviewController.getInterviewSummary );

module.exports = router;
