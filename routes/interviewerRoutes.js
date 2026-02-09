const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { createInterviewer, getAllInterviewers, getInterviewerById, updateInterviewer, deleteInterviewer, loginInterviewer } = require("../controllers/interViewerController");
const { adminOnly } = require("../middlewares/adminOnly");
const { adminMiddleware } = require("../middlewares/adminMiddleware");

const {
  createInterviewer,
  getAllInterviewers,
  getInterviewerById,
  updateInterviewer,
  deleteInterviewer
} = require("../controllers/interviewer.controller");

const { isAdmin } = require("../middlewares/adminMiddleware");
const router = express.Router();


router.post("/create", adminMiddleware,createInterviewer,adminOnly);

router.post("/login", adminMiddleware, loginInterviewer );

router.get("/", adminMiddleware, getAllInterviewers,adminOnly );

router.get("/:id", adminMiddleware,adminOnly, getInterviewerById);

router.put("/:id", adminMiddleware, adminOnly, updateInterviewer);

router.delete("/:id", adminMiddleware, adminOnly, deleteInterviewer);

module.exports = router;