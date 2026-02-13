const Feedback = require("../models/feedback.model");
const UserData = require("../models/UserData");

const ratingMap = {
  very_good: 5,
  good: 4,
  average: 3,
  bad: 2,
  very_bad: 1,
};

exports.createFeedback = async (req, res) => {
  try {
    const { userDataId, type, message } = req.body;

    if (!userDataId || !type) {
      return res.status(400).json({
        success: false,
        message: "userDataId and type are required",
      });
    }

    if (!ratingMap[type]) {
      return res.status(400).json({
        success: false,
        message: "Invalid feedback type",
      });
    }

    const userData = await UserData.findById(userDataId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "UserData not found",
      });
    }

    const feedback = await Feedback.create({
      userDataId,
      type,
      rating: ratingMap[type],
      message: message || "",
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    console.log("createFeedback error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


exports.getFeedbackStats = async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          totalResponses: { $sum: 1 },
          avgRating: { $avg: "$rating" },

          // rating distribution
          rating1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          rating5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },

          // sentiment
          positive: { $sum: { $cond: [{ $gte: ["$rating", 4] }, 1, 0] } },
          neutral: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          negative: { $sum: { $cond: [{ $lte: ["$rating", 2] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          totalResponses: 1,
          avgRating: { $round: ["$avgRating", 1] },

          positive: 1,
          neutral: 1,
          negative: 1,

          ratingDistribution: {
            1: "$rating1",
            2: "$rating2",
            3: "$rating3",
            4: "$rating4",
            5: "$rating5",
          },

          positivePercent: {
            $cond: [
              { $eq: ["$totalResponses", 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$positive", "$totalResponses"] },
                      100,
                    ],
                  },
                  0,
                ],
              },
            ],
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Feedback stats fetched successfully",
      data: stats[0] || {
        totalResponses: 0,
        avgRating: 0,
        positive: 0,
        neutral: 0,
        negative: 0,
        positivePercent: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      },
    });
  } catch (error) {
    console.log("getFeedbackStats error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



exports.getAllFeedbacks = async (req, res) => {
  try {
    const { filter = "all", search = "", page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    let ratingQuery = {};
    if (filter === "positive") ratingQuery = { rating: { $gte: 4 } };
    if (filter === "neutral") ratingQuery = { rating: 3 };
    if (filter === "negative") ratingQuery = { rating: { $lte: 2 } };

    const matchQuery = { ...ratingQuery };

    if (search) {
      matchQuery.message = { $regex: search, $options: "i" };
    }

    const feedbacks = await Feedback.find(matchQuery)
      .populate("userDataId", "name") // only name (no email)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Feedback.countDocuments(matchQuery);

    return res.status(200).json({
      success: true,
      message: "Feedback list fetched successfully",
      total,
      page: pageNum,
      limit: limitNum,
      data: feedbacks.map((f) => ({
        _id: f._id,
        name: f.userDataId?.name || "",
        type: f.type,
        rating: f.rating,
        message: f.message,

        createdAt: f.createdAt,
        date: new Date(f.createdAt).toDateString(),
      })),
    });
  } catch (error) {
    console.log("getAllFeedbacks error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


exports.getconditionBaseFeedbackStats = async (req, res) => {
  try {
    const { type } = req.query; // optional query parameter

    const matchStage = type
      ? { $match: { type: type } } // filter by type if provided
      : { $match: {} }; // no filter, include all

    const stats = await Feedback.aggregate([
      matchStage,
      {
        $group: {
          _id: null,
          totalResponses: { $sum: 1 },
          avgRating: { $avg: "$rating" },

          positive: {
            $sum: {
              $cond: [{ $in: ["$type", ["very_good", "good"]] }, 1, 0],
            },
          },
          neutral: {
            $sum: {
              $cond: [{ $eq: ["$type", "average"] }, 1, 0],
            },
          },
          negative: {
            $sum: {
              $cond: [{ $in: ["$type", ["bad", "very_bad"]] }, 1, 0],
            },
          },

          rating1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          rating5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          totalResponses: 1,
          avgRating: { $round: ["$avgRating", 1] },
          positive: 1,
          neutral: 1,
          negative: 1,
          ratingDistribution: {
            1: "$rating1",
            2: "$rating2",
            3: "$rating3",
            4: "$rating4",
            5: "$rating5",
          },
          positivePercent: {
            $cond: [
              { $eq: ["$totalResponses", 0] },
              0,
              {
                $round: [
                  { $multiply: [{ $divide: ["$positive", "$totalResponses"] }, 100] },
                  0,
                ],
              },
            ],
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Feedback stats fetched successfully",
      data: stats[0] || {
        totalResponses: 0,
        avgRating: 0,
        positive: 0,
        neutral: 0,
        negative: 0,
        positivePercent: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      },
    });
  } catch (error) {
    console.log("getFeedbackStats error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
