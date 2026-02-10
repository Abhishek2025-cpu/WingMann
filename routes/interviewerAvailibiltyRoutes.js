const express = require("express");
const { setAvailabilityForDate, getAvailabilityByInterviewer, getAllInterviewersAvailability,  updateAvailability, deleteAvailability, saveAvailability30MinSlots } = require("../controllers/interViewerAvailabilityController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/set-date", setAvailabilityForDate, protect);
router.get("/all", protect, getAllInterviewersAvailability);
router.get("/:interviewerId", getAvailabilityByInterviewer, protect);

router.post("/save-30min-slots", protect, saveAvailability30MinSlots)
router.put("/update/:availabilityId", updateAvailability, protect);

router.delete("/delete/:availabilityId", deleteAvailability, protect);

module.exports = router;
