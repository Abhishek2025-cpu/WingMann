

const express = require("express");
const router = express.Router();

const { createInterviewer, getAllInterviewers, getInterviewerById, updateInterviewer, deleteInterviewer, loginInterviewer } = require("../controllers/interviewer.controller");
const { adminMiddleware } = require("../middlewares/adminMiddleware");
const { adminOnly } = require("../middlewares/adminOnly");
const { upload } = require("../config/cloudinary"); // your cloudinary + multer config

// ------------------- Routes -------------------

// Create interviewer with optional profile photo upload
router.post(
  "/create-interviewer",
  adminMiddleware,
  upload.array("profilePhotos", 5), // existing flow stays intact
  createInterviewer
);
// Login interviewer
router.post("/login", adminMiddleware, loginInterviewer);

// Get all interviewers
router.get("/", adminMiddleware, adminOnly, getAllInterviewers);

// Get single interviewer by ID
router.get("/:id", adminMiddleware, adminOnly, getInterviewerById);

// Update interviewer with optional new profile photo
router.put(
  "/:id",
  adminMiddleware,
  upload.single("profilePhoto"), // optional new file
  adminOnly,
  updateInterviewer
);

// Delete interviewer
router.delete("/:id", adminMiddleware, adminOnly, deleteInterviewer);

module.exports = router;
