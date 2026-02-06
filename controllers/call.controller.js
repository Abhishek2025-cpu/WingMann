const CallSession = require("../models/CallSession");
const CallSignal = require("../models/CallSignal");
const sendFCM = require("../utils/sendFCM");

// START CALL
exports.startCall = async (req, res) => {
  const { receiverId, callType } = req.body;
  const callerId = req.user.id;

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  const call = await CallSession.create({
    callerId,
    receiverId,
    callType,
    expiresAt
  });

  await sendFCM(receiverId, {
    title: "Incoming Call",
    body: "You have an incoming call",
    data: {
      callId: call._id.toString(),
      callType
    }
  });

  res.json({ success: true, callId: call._id, expiresAt });
};

// ACCEPT
exports.acceptCall = async (req, res) => {
  const call = await CallSession.findById(req.params.callId);
  if (!call) return res.status(404).json({ message: "Call not found" });

  call.status = "ACCEPTED";
  call.acceptedAt = new Date();
  await call.save();

  res.json({ success: true });
};

// REJECT
exports.rejectCall = async (req, res) => {
  const call = await CallSession.findById(req.params.callId);
  if (!call) return res.status(404).json({ message: "Call not found" });

  call.status = "REJECTED";
  call.endedAt = new Date();
  await call.save();

  res.json({ success: true });
};

// END
exports.endCall = async (req, res) => {
  const call = await CallSession.findById(req.params.callId);
  if (!call) return res.status(404).json({ message: "Call not found" });

  call.status = "ENDED";
  call.endedAt = new Date();
  await call.save();

  res.json({ success: true });
};

// ✅ SEND SIGNAL
exports.sendSignal = async (req, res) => {
  const { type, payload } = req.body;

  await CallSignal.create({
    callId: req.params.callId,
    senderId: req.user.id,
    type,
    payload
  });

  res.json({ success: true });
};

// ✅ GET SIGNALS
exports.getSignals = async (req, res) => {
  const signals = await CallSignal.find({
    callId: req.params.callId
  }).sort({ createdAt: 1 });

  res.json({ success: true, signals });
};
