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

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      req.user = user;
      return next();

    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  }

  //  REMOVE guest access
  return res.status(401).json({
    success: false,
    message: "Not authorized, please login",
  });
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