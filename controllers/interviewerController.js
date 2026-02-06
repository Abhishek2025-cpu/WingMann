const Interviewer = require("../models/Interviewer");
const bcrypt = require("bcryptjs");
const generateEmailAndPassword = require("../utils/generateCredentials");

exports.createInterviewer = async (req, res) => {
  try {
    const {
      name,
      mobileNumber,
      city,
      state,
      country,
      address,
      pincode,
      gender,
      dob,
      designation,
      experience,
      skills,
      profilePhoto,
      resume,
      isActive,
    } = req.body;

    // basic required validation
    if (!name || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "name and mobileNumber are required",
      });
    }

    // auto generate email + password
    const { email, password } = generateEmailAndPassword(name);

    // check email exists
    const existing = await Interviewer.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "Interviewer already exists with generated email. Try different name.",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create interviewer
    const interviewer = await Interviewer.create({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
      city,
      state,
      country,
      address,
      pincode,
      gender,
      dob,
      designation,
      experience,
      skills,
      profilePhoto,
      resume,
      isActive,
      createdBy: req.user.id, // from JWT
    });

    return res.status(201).json({
      success: true,
      message: "Interviewer created successfully",
      data: {
        interviewer,
        generatedCredentials: {
          email,
          password, // plain password only in create response
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getAllInterviewers = async (req, res) => {
  try {
    const interviewers = await Interviewer.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: interviewers.length,
      data: interviewers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ GET INTERVIEWER BY ID (Admin Only)
exports.getInterviewerById = async (req, res) => {
  try {
    const interviewer = await Interviewer.findById(req.params.id).select(
      "-password"
    );

    if (!interviewer) {
      return res.status(404).json({
        success: false,
        message: "Interviewer not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: interviewer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateInterviewer = async (req, res) => {
  try {
    const interviewer = await Interviewer.findById(req.params.id);

    if (!interviewer) {
      return res.status(404).json({
        success: false,
        message: "Interviewer not found",
      });
    }

    // security: email/password update allowed nahi (optional)
    if (req.body.email || req.body.password) {
      return res.status(400).json({
        success: false,
        message: "Email and password cannot be updated directly",
      });
    }

    const updated = await Interviewer.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Interviewer updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ DELETE INTERVIEWER (Admin Only)
exports.deleteInterviewer = async (req, res) => {
  try {
    const interviewer = await Interviewer.findById(req.params.id);

    if (!interviewer) {
      return res.status(404).json({
        success: false,
        message: "Interviewer not found",
      });
    }

    await Interviewer.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Interviewer deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};