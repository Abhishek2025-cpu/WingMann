const UserData = require("../models/UserData");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
// 1. CREATE USER (Step 1: 17 Points + Generate Token)
exports.createUserData = async (req, res) => {
  try {
    const newUser = await UserData.create(req.body);

    // Generate JWT using New User ID
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token: token,
      userData: newUser, // ✅ Full user data included
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ UPLOAD IMAGES (Step 2: User ID + Max 6 Images)
exports.uploadImages = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!req.files) return res.status(400).json({ message: "No files uploaded" });

    const user = await UserData.findById(userId);
    
    if (!user) return res.status(404).json({ message: "User not found" });
  
    

    // ✅ req.files contains the Cloudinary info automatically
    const imageDetails = req.files.map(file => ({
      url: file.path,           // The Cloudinary HTTPS URL
      publicId: file.filename,  // The ID needed if you want to delete it later
    }));

    user.images = [...user.images, ...imageDetails].slice(0, 6);
    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET ALL USERDATA
exports.getAllUserData = async (req, res) => {
  try {
    const users = await UserData.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: users.length,
      data: users,
    });
  } catch (error) {
    console.log("GET ALL USERDATA ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching UserData",
      error: error.message,
    });
  }
};

// ✅ GET SINGLE USERDATA
exports.getSingleUserData = async (req, res) => {
  try {
    const user = await UserData.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "UserData not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log("GET SINGLE USERDATA ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching single UserData",
      error: error.message,
    });
  }
};

// ✅ UPDATE USERDATA
exports.updateUserData = async (req, res) => {
  try {
    const user = await UserData.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "UserData not found",
      });
    }

    // 1) handle images (append new images)
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      }));

      user.images = [...user.images, ...newImages];
    }

    // 2) Interests handle
    let interests = user.interests;
    if (req.body.interests) {
      if (Array.isArray(req.body.interests)) {
        interests = req.body.interests;
      } else {
        interests = [req.body.interests];
      }
    }

    // 3) update fields (only if provided)
    user.gender = req.body.gender ?? user.gender;
    user.name = req.body.name ?? user.name;
    user.dob = req.body.dob ?? user.dob;
    user.height = req.body.height ?? user.height;

    user.location.address = req.body.address ?? user.location.address;
    user.location.coordinates.lat =
      req.body.lat ?? user.location.coordinates.lat;
    user.location.coordinates.lng =
      req.body.lng ?? user.location.coordinates.lng;

    user.state = req.body.state ?? user.state;
    user.story = req.body.story ?? user.story;
    user.type = req.body.type ?? user.type;

    user.college = req.body.college ?? user.college;
    user.course = req.body.course ?? user.course;

    user.company = req.body.company ?? user.company;
    user.position = req.body.position ?? user.position;

    user.education = req.body.education ?? user.education;
    user.religion = req.body.religion ?? user.religion;
    user.habits = req.body.habits ?? user.habits;

    user.interests = interests;

    user.lifestyle.drink = req.body.drink ?? user.lifestyle.drink;
    user.lifestyle.smoke = req.body.smoke ?? user.lifestyle.smoke;
    user.lifestyle.exercise = req.body.exercise ?? user.lifestyle.exercise;

    const updated = await user.save();

    return res.status(200).json({
      success: true,
      message: "UserData updated successfully",
      data: updated,
    });
  } catch (error) {
    console.log("UPDATE USERDATA ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating UserData",
      error: error.message,
    });
  }
};

// ✅ DELETE USERDATA
exports.deleteUserData = async (req, res) => {
  try {
    const user = await UserData.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "UserData not found",
      });
    }

    await UserData.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "UserData deleted successfully",
    });
  } catch (error) {
    console.log("DELETE USERDATA ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting UserData",
      error: error.message,
    });
  }
};
