// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/Registration");

/* ================= AUTH PROTECT ================= */
const protect = async (req, res, next) => {
  let token;

  // Check Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }

      return next();
    } catch (error) {
      console.error("JWT Error:", error);
      return res
        .status(401)
        .json({ success: false, message: "Token invalid or expired" });
    }
  }

  // No token
  return res
    .status(401)
    .json({ success: false, message: "No token provided" });
};

/* ================= ADMIN ONLY ================= */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res
    .status(403)
    .json({ success: false, message: "Access denied. Admins only." });
};

/* ================= VENDOR ONLY ================= */
const vendorOnly = (req, res, next) => {
  if (req.user && req.user.role === "seller") {
    return next();
  }

  return res
    .status(403)
    .json({ success: false, message: "Access denied. Vendors only." });
};

module.exports = { protect, adminOnly, vendorOnly };
