const express = require("express");
const router = express.Router();

const { 
  createInterviewer, 
  getAllInterviewers, 
  getInterviewerById, 
  updateInterviewer, 
  deleteInterviewer, 
  loginInterviewer 
} = require("../controllers/interviewer.controller");

const { adminMiddleware } = require("../middlewares/adminMiddleware");
const { adminOnly } = require("../middlewares/adminOnly");
const { upload } = require("../config/cloudinary"); 

// ------------------- Routes -------------------

// Create interviewer 
// Expects form-data key: "profilePhotos"
router.post(
  "/create-interviewer",
  adminMiddleware,
  upload.array("profilePhotos", 5), 
  createInterviewer
);

// Login interviewer
router.post("/login", loginInterviewer); // Removed adminMiddleware (Login shouldn't require a token first)

// Get all interviewers
router.get("/", adminMiddleware, adminOnly, getAllInterviewers);

// Get single interviewer by ID
router.get("/:id", adminMiddleware, adminOnly, getInterviewerById);

// Update interviewer 
// Changed to upload.array to match the Model and Controller logic
// Expects form-data key: "profilePhotos"
router.put(
  "/:id",
  adminMiddleware,
  upload.array("profilePhotos", 5), 
  adminOnly,
  updateInterviewer
);

// Delete interviewer
router.delete("/:id", adminMiddleware, adminOnly, deleteInterviewer);

module.exports = router;