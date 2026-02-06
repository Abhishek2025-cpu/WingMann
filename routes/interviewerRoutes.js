const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { createInterviewer, getAllInterviewers, getInterviewerById, updateInterviewer, deleteInterviewer } = require("../controllers/interViewerController");
const { isAdmin } = require("../middlewares/adminMiddleware");
const router = express.Router();


router.post("/create", protect, createInterviewer, isAdmin);

router.get("/", protect, getAllInterviewers, isAdmin);

router.get("/:id", protect, isAdmin, getInterviewerById);

router.put("/:id", protect, isAdmin, updateInterviewer);

router.delete("/:id", protect, isAdmin, deleteInterviewer);

module.exports = router;