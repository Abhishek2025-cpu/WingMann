const UserData = require("../models/UserData");
const jwt = require("jsonwebtoken");
const UserAvailability = require("../models/UserAvailability");


// exports.createUserData = async (req, res) => {
//   try {
//     // ✅ uploaded images URLs from cloudinary
//     const images = req.files ? req.files.map((file) => file.path) : [];

//     // ✅ create user with images saved in DB
//     const newUser = await UserData.create({
//       ...req.body,
//       images: images, // store in mongodb
//     });

//     // ✅ generate token
//     const token = jwt.sign(
//       { id: newUser._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "30d" }
//     );

//     res.status(201).json({
//       success: true,
//       message: "User created successfully",
//       token,
//       userData: newUser,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };
exports.createUserData = async (req, res) => {
  try {
    // ✅ Check if mobile exists
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    // ✅ uploaded images URLs from cloudinary
    const images = req.files ? req.files.map((file) => file.path) : [];

    // ✅ create user with images saved in DB
    const newUser = await UserData.create({
      ...req.body,
      images: images,
    });

    // ✅ generate token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      userData: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const userId = req.body.userId || req.body.userid;
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const user = await UserData.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const imageDetails = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    user.images = [...user.images, ...imageDetails].slice(0, 6);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllUserData = async (req, res) => {
  try {
    const users = await UserData.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      total: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSingleUserData = async (req, res) => {
  try {
    const user = await UserData.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "UserData not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateUserData = async (req, res) => {
  try {
    const user = await UserData.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "UserData not found" });
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }));
      user.images = [...user.images, ...newImages].slice(0, 6);
    }

    if (req.body.interests) {
      user.interests = Array.isArray(req.body.interests) 
        ? req.body.interests 
        : [req.body.interests];
    }

    user.gender = req.body.gender ?? user.gender;
    user.name = req.body.name ?? user.name;
    user.dob = req.body.dob ?? user.dob;
    user.height = req.body.height ?? user.height;
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

    if (user.location) {
        user.location.address = req.body.address ?? user.location.address;
        if (user.location.coordinates) {
            user.location.coordinates.lat = req.body.lat ?? user.location.coordinates.lat;
            user.location.coordinates.lng = req.body.lng ?? user.location.coordinates.lng;
        }
    }

    if (user.lifestyle) {
        user.lifestyle.drink = req.body.drink ?? user.lifestyle.drink;
        user.lifestyle.smoke = req.body.smoke ?? user.lifestyle.smoke;
        user.lifestyle.exercise = req.body.exercise ?? user.lifestyle.exercise;
    }

    const updated = await user.save();

    res.status(200).json({
      success: true,
      message: "UserData updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteUserData = async (req, res) => {
  try {
    const user = await UserData.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "UserData not found" });
    }
    res.status(200).json({ success: true, message: "UserData deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.getUserSummary = async (req, res) => {
  try {
    // 1️⃣ Get page and limit from query params (default: page=1, limit=10)
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    // 2️⃣ Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // 3️⃣ Fetch users with pagination
    const users = await UserData.find({}, "name gender state mobile age email createdAt")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // optional: newest first

    // 4️⃣ Get total count for frontend pagination
    const totalUsers = await UserData.countDocuments();

    res.status(200).json({
      success: true,
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


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
    const { userDataId, date, timeSlots } = req.body;

    // validation
    if (!userDataId || !date) {
      return res.status(400).json({
        success: false,
        message: "userDataId and date are required",
      });
    }

    if (!timeSlots || !Array.isArray(timeSlots) || timeSlots.length === 0) {
      return res.status(400).json({
        success: false,
        message: "timeSlots array is required",
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

    // ✅ Save in DB using userDataId only
    let saved = await UserAvailability.findOne({ userDataId, date: selectedDate });

    if (saved) {
      // update existing
      saved.timeSlots = generatedSlots;
      await saved.save();
    } else {
      // create new
      saved = await UserAvailability.create({
        userDataId,
        date: selectedDate,
        timeSlots: generatedSlots,
      });
    }

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