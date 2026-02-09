const InterviewerAvailability = require("../models/InterviewerAvailability");
const Interviewer = require("../models/Interviewer");

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

// ✅ 3) GET AVAILABILITY BY DATE
exports.getAvailabilityByDate = async (req, res) => {
  try {
    const { interviewerId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "date query is required (YYYY-MM-DD)",
      });
    }

    const selectedDate = String(date).trim();

    const availability = await InterviewerAvailability.findOne({
      interviewerId,
      date: selectedDate,
    });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "No availability found for this date",
      });
    }

    return res.status(200).json({
      success: true,
      data: availability,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ 4) GET ONLY TIMESLOTS (Calendar use)
exports.getTimeSlotsByDate = async (req, res) => {
  try {
    const { interviewerId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "date query is required (YYYY-MM-DD)",
      });
    }

    const selectedDate = String(date).trim();

    const availability = await InterviewerAvailability.findOne({
      interviewerId,
      date: selectedDate,
    }).select("date timeSlots interviewerId");

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "No availability found for this date",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        interviewerId,
        date: availability.date,
        timeSlots: availability.timeSlots,
      },
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
