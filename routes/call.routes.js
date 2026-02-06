const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const controller = require("../controllers/call.controller");

router.post("/start", protect, controller.startCall);
router.post("/:callId/accept", protect, controller.acceptCall);
router.post("/:callId/reject", protect, controller.rejectCall);
router.post("/:callId/end", protect, controller.endCall);

router.post("/:callId/signal", protect, controller.sendSignal);
router.get("/:callId/signals", protect, controller.getSignals);

module.exports = router;
