const express = require("express");
const { setAvailabilityForDate, getAvailabilityByInterviewer, getAvailabilityByDate, getTimeSlotsByDate, updateAvailability, deleteAvailability } = require("../controllers/interViewerAvailabilityController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/set-date", setAvailabilityForDate, protect);

router.get("/:interviewerId", getAvailabilityByInterviewer, protect);

router.get("/:interviewerId/by-date", getAvailabilityByDate, protect);

router.get("/:interviewerId/time-slots", getTimeSlotsByDate, protect);

router.put("/update/:availabilityId", updateAvailability, protect);

router.delete("/delete/:availabilityId", deleteAvailability, protect);

module.exports = router;
