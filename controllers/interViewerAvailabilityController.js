const InterviewerAvailability = require("../models/InterviewerAvailability");
const Interviewer = require("../models/Interviewer");
const UserData = require("../models/UserData");
const mongoose = require("mongoose")
// ✅ 1) SET AVAILABILITY (Create/Update for same date)
exports.setAvailabilityForDay = async (req, res) => {
  try {
    const { interviewerId, day, timeSlots } = req.body;

    if (!interviewerId || !day) {
      return res.status(400).json({
        success: false,
        message: "interviewerId and day are required",
      });
    }

    if (!timeSlots || !Array.isArray(timeSlots) || timeSlots.length === 0) {
      return res.status(400).json({
        success: false,
        message: "timeSlots must be a non-empty array",
      });
    }

    const saved = await InterviewerAvailability.findOneAndUpdate(
      { interviewerId, day: String(day).trim() },
      { $push: { timeSlots: { $each: timeSlots } } }, // ✅ adds multiple slots
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Slot added successfully",
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

    const data = await InterviewerAvailability.find({ interviewerId });

    return res.status(200).json({
      success: true,
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



exports.updateAvailability = async (req, res) => {
  try {
    const { availabilityId } = req.params;
    const { date, timeSlots } = req.body;

    if (!mongoose.Types.ObjectId.isValid(availabilityId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid availabilityId",
      });
    }

    const availability = await InterviewerAvailability.findById(availabilityId);

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "Availability not found",
      });
    }

    // ✅ Date duplicate check (only interviewerId + date)
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
exports.deleteSlot = async (req, res) => {
  try {
    const { availabilityId, slotId } = req.params;

    const updated = await InterviewerAvailability.findByIdAndUpdate(
      availabilityId,
      { $pull: { timeSlots: { _id: slotId } } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Slot removed",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.deleteAvailabilityByDate = async (req, res) => {
  try {
    const { interviewerId, date } = req.query;

    if (!interviewerId || !date) {
      return res.status(400).json({
        success: false,
        message: "interviewerId and date are required",
      });
    }

    const deleted = await InterviewerAvailability.findOneAndDelete({
      interviewerId,
      date: String(date).trim(),
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "No availability found for this date",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Whole day availability deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.deleteSlotByDate = async (req, res) => {
  try {
    const { interviewerId, date, slotId } = req.query;

    if (!interviewerId || !date || !slotId) {
      return res.status(400).json({
        success: false,
        message: "interviewerId, date and slotId are required",
      });
    }

    const updated = await InterviewerAvailability.findOneAndUpdate(
      { interviewerId, date: String(date).trim() },
      { $pull: { timeSlots: { _id: slotId } } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Availability not found for this date",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Slot deleted successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
