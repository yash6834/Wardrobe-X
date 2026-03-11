const jwt = require("jsonwebtoken");
const User = require("../models/Registration");

/* ================= OPTIONAL AUTH ================= */
/* Works for both logged-in users and guests */

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (user) {
        req.user = user;
      }

    } catch (error) {
      console.error("JWT Error:", error.message);
    }
  }

  // Continue even if no token (guest user)
  next();
};

/* ================= ADMIN ONLY ================= */

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Admins only."
  });
};

/* ================= VENDOR ONLY ================= */

const vendorOnly = (req, res, next) => {
  if (req.user && req.user.role === "seller") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Vendors only."
  });
};

module.exports = { protect, adminOnly, vendorOnly };