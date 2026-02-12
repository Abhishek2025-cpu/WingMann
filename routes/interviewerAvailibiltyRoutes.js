const express = require("express");
const { setAvailabilityForDate, getAvailabilityByInterviewer, getAllInterviewersAvailability,  updateAvailability, deleteAvailability, saveAvailability30MinSlots, deleteSlot, deleteAvailabilityByDate, deleteSlotByDate } = require("../controllers/interViewerAvailabilityController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/set", setAvailabilityForDate, protect);
router.get("/all", protect, getAllInterviewersAvailability);
router.get("/:interviewerId",protect, getAvailabilityByInterviewer);
router.delete("/delete-day", protect, deleteAvailabilityByDate);
router.delete("/delete-slot-by-date", protect, deleteSlotByDate);


router.post("/save-30min-slots", protect, saveAvailability30MinSlots);
router.put("/update/:availabilityId", updateAvailability, protect);

router.delete("/delete/:availabilityId", protect, deleteSlot);

module.exports = router;
