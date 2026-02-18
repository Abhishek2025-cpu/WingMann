const Visit = require("../models/Visit");
const VisitSummary = require("../models/VisitSummary");

exports.addVisit = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID missing from request",
        visited: false,
      });
    }

    // 1️⃣ Find or create summary document
    let summary = await VisitSummary.findOne();
    if (!summary) {
      summary = await VisitSummary.create({
        totalUniqueVisitors: 0,
        totalVisits: 0,
      });
    }

    // 2️⃣ Check if this user has already visited
    const alreadyVisited = await Visit.findOne({ user: userId });

    if (!alreadyVisited) {
      // 3️⃣ Record visit only for new users
      await Visit.create({
        user: userId,
        visitedAt: new Date(),
      });

      // 4️⃣ Update summary counters
      summary.totalUniqueVisitors += 1;
      summary.totalVisits += 1;
      await summary.save();

      return res.status(201).json({
        success: true,
        message: "Visit counted successfully",
        visited: true,
        totalUniqueVisitors: summary.totalUniqueVisitors,
        totalVisits: summary.totalVisits,
      });
    }

    // 5️⃣ If user already visited, return existing summary
    return res.status(200).json({
      success: true,
      message: "User already visited",
      visited: true,
      totalUniqueVisitors: summary.totalUniqueVisitors,
      totalVisits: summary.totalVisits,
    });

  } catch (error) {
    console.error("addVisit ERROR:", error.message);
    console.error(error.stack);

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
