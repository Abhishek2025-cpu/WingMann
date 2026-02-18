const express = require("express");
const { setAvailabilityForDate, getAvailabilityByInterviewer, getAllInterviewersAvailability,  updateAvailability, deleteAvailability, saveAvailability30MinSlots, deleteSlot, deleteAvailabilityByDate, deleteSlotByDate, getTotalInterviewsCreated, getTotalDates, setAvailabilityForDay } = require("../controllers/interViewerAvailabilityController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/set", setAvailabilityForDay, protect);
router.get("/all", protect, getAllInterviewersAvailability);

router.get("/:interviewerId",protect, getAvailabilityByInterviewer);
router.delete("/delete-day", protect, deleteAvailabilityByDate);
router.delete("/delete-slot-by-date", protect, deleteSlotByDate);



router.put("/update/:availabilityId", updateAvailability, protect);

router.delete("/delete/:availabilityId", protect, deleteSlot);

module.exports = router;
