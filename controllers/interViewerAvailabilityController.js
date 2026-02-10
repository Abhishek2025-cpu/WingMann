const InterviewerAvailability = require("../models/InterviewerAvailability");
const Interviewer = require("../models/Interviewer");
const UserData = require("../models/UserData");
// ✅ 1) SET AVAILABILITY (Create/Update for same date)
exports.setAvailabilityForDate = async (req, res) => {
  try {
    const { interviewerId, date, timeSlots } = req.body;

    if (!interviewerId || !date) {
      return res.status(400).json({
        success: false,
        message: "interviewerId and date are required",
      });
    }

    if (!timeSlots || !Array.isArray(timeSlots) || timeSlots.length === 0) {
      return res.status(400).json({
        success: false,
        message: "timeSlots array is required",
      });
    }

    // interviewer exists check
    const interviewer = await Interviewer.findById(interviewerId);
    if (!interviewer) {
      return res.status(404).json({
        success: false,
        message: "Interviewer not found",
      });
    }

    const selectedDate = String(date).trim(); // "YYYY-MM-DD"

    // upsert
    const saved = await InterviewerAvailability.findOneAndUpdate(
      { interviewerId, date: selectedDate },
      { $set: { timeSlots } },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Availability saved successfully",
      data: saved,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ 2) GET ALL AVAILABILITY (All dates) of interviewer
exports.getAvailabilityByInterviewer = async (req, res) => {
  try {
    const { interviewerId } = req.params;

    const data = await InterviewerAvailability.find({ interviewerId })
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllInterviewersAvailability = async (req, res) => {
  try {
    const { date } = req.query; // optional

    let filter = {};

    // agar date aayi to date filter lagao
    if (date) {
      filter.date = String(date).trim(); // "YYYY-MM-DD"
    }

    const data = await InterviewerAvailability.find(filter)
      .populate("interviewerId", "name email") // interviewer details (optional)
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ 5) UPDATE DATE + TIMESLOTS by availabilityId
exports.updateAvailability = async (req, res) => {
  try {
    const { availabilityId } = req.params;
    const { date, timeSlots } = req.body;

    const availability = await InterviewerAvailability.findById(availabilityId);

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "Availability not found",
      });
    }

    // ✅ If date updating, check duplicate date for same interviewer
    if (date) {
      const newDate = String(date).trim();

      const alreadyExists = await InterviewerAvailability.findOne({
        interviewerId: availability.interviewerId,
        date: newDate,
        _id: { $ne: availabilityId },
      });

      if (alreadyExists) {
        return res.status(400).json({
          success: false,
          message: "Availability already exists for this date",
        });
      }

      availability.date = newDate;
    }

    // update timeSlots
    if (timeSlots && Array.isArray(timeSlots)) {
      availability.timeSlots = timeSlots;
    }

    await availability.save();

    return res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: availability,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ 6) DELETE availability by availabilityId
exports.deleteAvailability = async (req, res) => {
  try {
    const { availabilityId } = req.params;

    const deleted = await InterviewerAvailability.findByIdAndDelete(availabilityId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Availability not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Availability deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//30 minutes time slots

// helpers
const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTime = (mins) => {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
};

const splitInto30MinSlots = (startTime, endTime) => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  const slots = [];

  for (let t = start; t < end; t += 30) {
    const slotStart = t;
    const slotEnd = t + 30;

    if (slotEnd > end) break;

    slots.push({
      startTime: minutesToTime(slotStart),
      endTime: minutesToTime(slotEnd),
      isBooked: false,
    });
  }

  return slots;
};

const uniqueSlots = (slots) => {
  const map = new Map();
  for (let s of slots) {
    const key = `${s.startTime}-${s.endTime}`;
    if (!map.has(key)) map.set(key, s);
  }
  return Array.from(map.values());
};

exports.saveAvailability30MinSlots = async (req, res) => {
  try {
    const { interviewerId, userDataId, date, timeSlots } = req.body;

    // validation
    if (!interviewerId || !userDataId || !date) {
      return res.status(400).json({
        success: false,
        message: "interviewerId, userDataId and date are required",
      });
    }

    if (!timeSlots || !Array.isArray(timeSlots) || timeSlots.length === 0) {
      return res.status(400).json({
        success: false,
        message: "timeSlots array is required",
      });
    }

    // check interviewer
    const interviewer = await Interviewer.findById(interviewerId);
    if (!interviewer) {
      return res.status(404).json({
        success: false,
        message: "Interviewer not found",
      });
    }

    // check userData
    const userData = await UserData.findById(userDataId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "UserData not found",
      });
    }

    const selectedDate = String(date).trim();

    // generate 30-min slots
    let generatedSlots = [];
    for (let slot of timeSlots) {
      if (!slot.startTime || !slot.endTime) continue;
      generatedSlots = [...generatedSlots, ...splitInto30MinSlots(slot.startTime, slot.endTime)];
    }

    generatedSlots = uniqueSlots(generatedSlots);

    if (generatedSlots.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid 30-min slots generated. Check startTime/endTime.",
      });
    }

    // ✅ Save in DB with userDataId
    let saved = await InterviewerAvailability.findOne({ interviewerId, userDataId, date: selectedDate });

    if (saved) {
      // update existing
      saved.timeSlots = generatedSlots;
      await saved.save();
    } else {
      // create new
      saved = await InterviewerAvailability.create({
        interviewerId,
        userDataId,
        date: selectedDate,
        timeSlots: generatedSlots,
      });
    }

    // ✅ response will include userDataId
    return res.status(200).json({
      success: true,
      message: "Availability saved successfully in 30-min slots",
      data: saved,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
