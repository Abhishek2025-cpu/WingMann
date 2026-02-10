const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.adminMiddleware = async (req, res, next) => {
  try {
    // 1) Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Find admin from DB
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }

    // 4) Check admin role
    if (admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied, admin only",
      });
    }

    // 5) Attach admin data
    req.admin = admin;
    req.user = decoded; // optional

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid token",
      error: error.message,
    });
  }
};
