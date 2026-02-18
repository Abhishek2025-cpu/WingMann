const UserData = require("../models/UserData");
const Interviewer = require("../models/Interviewer");
const Interview = require("../models/Interview");

// Helper: deterministic pseudo-random index from string
function hashToIndex(str, max) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash) % max;
}

exports.createInterview = async (req, res) => {
  try {
    const { userDataId, slots } = req.body;

    if (!userDataId || !slots || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const user = await UserData.findById(userDataId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Fetch all active interviewers
    const interviewers = await Interviewer.find({ isActive: true });
    if (!interviewers.length) return res.status(404).json({ success: false, message: "No interviewers available" });

    const assignedSlots = [];

    for (let slot of slots) {
      // Filter interviewers who have this slot free
      const availableInterviewers = interviewers.filter(interviewer =>
        interviewer.availableSlots.some(
          s => s.day === slot.day && s.time === slot.time && !s.isBooked
        )
      );

      if (!availableInterviewers.length) continue; // Skip if no free interviewer

      // Pseudo-random deterministic pick based on slot day+time
      const index = hashToIndex(slot.day + slot.time, availableInterviewers.length);
      const selectedInterviewer = availableInterviewers[index];

      // Mark the slot as booked
      const slotToBook = selectedInterviewer.availableSlots.find(
        s => s.day === slot.day && s.time === slot.time
      );
      slotToBook.isBooked = true;
      await selectedInterviewer.save();

      // Create interview record
      await Interview.create({
        userDataId,
        interviewerId: selectedInterviewer._id,
        slots: [{ day: slot.day, time: slot.time }],
      });

      // Push to response array
      assignedSlots.push({
        userDataId: user._id,
        userName: user.name,
        interviewerId: selectedInterviewer._id,
        interviewerName: selectedInterviewer.name,
        slots: [{ day: slot.day, time: slot.time }],
      });
    }

    if (!assignedSlots.length)
      return res.status(400).json({ success: false, message: "No slots could be assigned" });

    return res.status(200).json({ success: true, data: assignedSlots });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

exports.getInterviewSummary = async (req, res) => {
  try {
    // Get day from query param, fallback to today
    let day = req.query.day;
    if (!day) {
      const today = new Date();
      const offset = today.getTimezoneOffset() * 60000; // adjust timezone
      day = new Date(today.getTime() - offset).toISOString().split("T")[0]; // YYYY-MM-DD
    }

    // Fetch all interviews
    const allInterviews = await Interview.find({})
      .populate("userDataId", "name")
      .populate("interviewerId", "name");

    const totalInterviews = allInterviews.length;

    // Filter interviews matching the requested day
    const filteredInterviews = allInterviews.filter(interview =>
      interview.slots.some(slot => slot.day === day)
    );

    // Format data
    const data = filteredInterviews.map(interview => ({
      userDataId: interview.userDataId._id,
      userName: interview.userDataId.name,
      interviewerId: interview.interviewerId._id,
      interviewerName: interview.interviewerId.name,
      slots: interview.slots.filter(slot => slot.day === day),
    }));

    return res.status(200).json({
      success: true,
      summary: {
        totalInterviews,
        requestedDayInterviews: data.length,
      },
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};