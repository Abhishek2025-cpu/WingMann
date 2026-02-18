const jwt = require("jsonwebtoken");

// Middleware to protect routes and attach user ID
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID to req.user
    req.user = {
      id: decoded.id || decoded._id, // support both id and _id
      email: decoded.email,           // optional: attach email if present
      role: decoded.role || "user",   // optional: attach role
    };

    next(); // proceed to controller
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid",
      error: err.message,
    });
  }
};

module.exports = protect;
