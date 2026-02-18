const Visit = require("../models/Visit");
const VisitSummary = require("../models/VisitSummary");

// ✅ POST: Add visit (unique)
exports.addVisit = async (req, res) => {
  try {
    const userId = req.user.id; // 🔥 decoded token se

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not found in token",
      });
    }

    // Summary doc
    let summary = await VisitSummary.findOne();
    if (!summary) summary = await VisitSummary.create({ totalUniqueVisitors: 0 });

    // Check already visited?
    const alreadyVisited = await Visit.findOne({ user: userId });

    if (alreadyVisited) {
      return res.status(200).json({
        success: true,
        message: "User already visited",
        visited: true,
        totalUniqueVisitors: summary.totalUniqueVisitors,
      });
    }

    // Create visit record
    await Visit.create({
      user: userId,
      visited: true,
      visitedAt: new Date(),
    });

    // Update summary
    summary.totalUniqueVisitors = summary.totalUniqueVisitors + 1;
    await summary.save();

    return res.status(201).json({
      success: true,
      message: "Visit counted successfully",
      visited: true,
      totalUniqueVisitors: summary.totalUniqueVisitors,
    });
  } catch (error) {
    console.log("addVisit error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      visited: false,
    });
  }
};

// ✅ GET: Check current user visited true/false
exports.checkMyVisit = async (req, res) => {
  try {
    const userId = req.user.id;

    const visit = await Visit.findOne({ user: userId });

    return res.status(200).json({
      success: true,
      visited: visit ? true : false,
    });
  } catch (error) {
    console.log("checkMyVisit error:", error);

    return res.status(500).json({
      success: false,
      visited: false,
      message: "Server error",
    });
  }
};

// ✅ GET: Summary
exports.getVisitSummary = async (req, res) => {
  try {
    let summary = await VisitSummary.findOne();
    if (!summary) summary = await VisitSummary.create({ totalUniqueVisitors: 0 });

    return res.status(200).json({
      success: true,
      totalUniqueVisitors: summary.totalUniqueVisitors,
    });
  } catch (error) {
    console.log("getVisitSummary error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
