const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { createOrUpdatePreference, getPreference, deletePreference } = require("../controllers/preferenceController");

// Create or Update preference
router.post("/create-preference/:id", protect, createOrUpdatePreference);

// Get preference by userDataId
router.get("/preference/:id", protect, getPreference);
router.delete("/delete-preference/:id", protect, deletePreference);
module.exports = router;
