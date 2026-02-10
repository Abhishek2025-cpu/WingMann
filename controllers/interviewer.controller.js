const Interviewer = require("../models/Interviewer");
const bcrypt = require("bcryptjs");
const generateEmailAndPassword = require("../utils/generateCredentials");
const jwt = require("jsonwebtoken")
const {generateCredentials} = require("../utils/generateCredentials"); //new  

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

    // -----------------------
    // HANDLE CLOUDINARY FILES
    // -----------------------
    // Check if files were uploaded
    let profilePhotos = [];
    if (req.files && req.files.length > 0) {
      profilePhotos = req.files.map((file) => file.path); // Cloudinary URLs
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
      skills: skills ? skills.split(",") : [], // optional comma-separated
      profilePhotos, // <-- added Cloudinary URLs
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

    // security: email/password update allowed nahi
    if (req.body.email || req.body.password) {
      return res.status(400).json({
        success: false,
        message: "Email and password cannot be updated directly",
      });
    }

    // copy body data (so we can safely modify it)
    const updateData = { ...req.body };

    // ✅ If new profile photos uploaded, save cloudinary URLs
    if (req.files && req.files.length > 0) {
      const uploadedPhotos = req.files.map((file) => file.path); // Cloudinary URL
      updateData.profilePhotos = uploadedPhotos; // overwrite existing photos
    }

    // Optional: skills handle (if you send as comma-separated string)
    if (updateData.skills && typeof updateData.skills === "string") {
      updateData.skills = updateData.skills.split(",").map((s) => s.trim());
    }

    const updated = await Interviewer.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
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

// ✅ INTERVIEWER LOGIN
// exports.loginInterviewer = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // validation
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "email and password are required",
//       });
//     }

//     // find interviewer
//     const interviewer = await Interviewer.findOne({ email });

//     if (!interviewer) {
//       return res.status(404).json({
//         success: false,
//         message: "Interviewer not found",
//       });
//     }

//     // check active status
//     if (!interviewer.isActive) {
//       return res.status(403).json({
//         success: false,
//         message: "Your account is inactive. Please contact admin.",
//       });
//     }

//     // compare password
//     const isMatch = await bcrypt.compare(password, interviewer.password);

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     // generate token
//     const token = jwt.sign(
//       { id: interviewer._id, role: "interviewer" },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       data: {
//         interviewer: {
//           _id: interviewer._id,
//           name: interviewer.name,
//           email: interviewer.email,
//           mobileNumber: interviewer.mobileNumber,
//           city: interviewer.city,
//           state: interviewer.state,
//           country: interviewer.country,
//           designation: interviewer.designation,
//           skills: interviewer.skills,
//           profilePhoto: interviewer.profilePhoto,
//           isActive: interviewer.isActive,
//           createdAt: interviewer.createdAt,
//         },
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// ✅ INTERVIEWER LOGIN
exports.loginInterviewer = async (req, res) => {
  try {
    let { email, password } = req.body;

    // ✅ validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    // ✅ clean email + password
    email = email.trim().toLowerCase();
    password = String(password).trim();

    // ✅ find interviewer by email
    const interviewer = await Interviewer.findOne({ email });

    if (!interviewer) {
      return res.status(404).json({
        success: false,
        message: "Interviewer not found with this email",
      });
    }

    // ✅ active check
    if (!interviewer.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact admin.",
      });
    }

    // ✅ password match
    const isMatch = await bcrypt.compare(password, interviewer.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // ✅ JWT token
    const token = jwt.sign(
      {
        id: interviewer._id,
        role: "interviewer",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        interviewer: {
          _id: interviewer._id,
          name: interviewer.name,
          email: interviewer.email,
          mobileNumber: interviewer.mobileNumber,
          city: interviewer.city,
          state: interviewer.state,
          country: interviewer.country,
          address: interviewer.address,
          pincode: interviewer.pincode,
          gender: interviewer.gender,
          dob: interviewer.dob,
          designation: interviewer.designation,
          experience: interviewer.experience,
          skills: interviewer.skills,
          profilePhoto: interviewer.profilePhoto,
          resume: interviewer.resume,
          isActive: interviewer.isActive,
          createdBy: interviewer.createdBy,
          createdAt: interviewer.createdAt,
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
