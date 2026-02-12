const express = require("express");
const { setAvailabilityForDate, getAvailabilityByInterviewer, getAllInterviewersAvailability,  updateAvailability, deleteAvailability, saveAvailability30MinSlots, deleteSlot } = require("../controllers/interViewerAvailabilityController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/set", setAvailabilityForDate, protect);
router.get("/all", protect, getAllInterviewersAvailability);
router.get("/:interviewerId",protect, getAvailabilityByInterviewer);

router.post("/save-30min-slots", protect, saveAvailability30MinSlots);
router.put("/update/:availabilityId", updateAvailability, protect);

router.delete("/delete/:availabilityId", protect, deleteSlot);

module.exports = router;
