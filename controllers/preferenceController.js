const Preference = require("../models/Preferences");
const jwt = require("jsonwebtoken");

// ✅ CREATE OR UPDATE Preference using URL id and token from header
const createOrUpdatePreference = async (req, res) => {
  try {
    const userDataId = req.params.id; // from URL
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1]; // extract token

    const { age, height, religion, ethnicity, spokenLanguage } = req.body;

    if (!age || !height || !religion || !ethnicity || !spokenLanguage) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if preference already exists
    let preference = await Preference.findOne({ userDataId });

    if (preference) {
      // Update existing preference
      preference.token = token; // save token from header
      preference.age = age;
      preference.height = height;
      preference.religion = religion;
      preference.ethnicity = ethnicity;
      preference.spokenLanguage = spokenLanguage;

      await preference.save();
      return res.status(200).json({
        success: true,
        message: "Preference updated successfully",
        data: preference,
      });
    }

    // Create new preference
    const newPreference = new Preference({
      userDataId,
      token,
      age,
      height,
      religion,
      ethnicity,
      spokenLanguage,
    });

    await newPreference.save();
    res.status(201).json({
      success: true,
      message: "Preference created successfully",
      data: newPreference,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET Preference by userDataId from URL
const getPreference = async (req, res) => {
  try {
    const userDataId = req.params.id;
    const preference = await Preference.findOne({ userDataId }).populate("userDataId");

    if (!preference) {
      return res.status(404).json({ success: false, message: "Preference not found" });
    }

    res.json({ success: true, data: preference });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePreference = async (req, res) => {
  try {
    const userDataId = req.params.id;

    const preference = await Preference.findOne({ userDataId });

    if (!preference) {
      return res.status(404).json({
        success: false,
        message: "Preference not found for this user",
      });
    }

    await Preference.deleteOne({ userDataId });

    res.status(200).json({
      success: true,
      message: "Preference deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrUpdatePreference, getPreference, deletePreference };
