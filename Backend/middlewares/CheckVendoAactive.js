const User = require("../models/Registration");

const checkVendorActive = async (req, res, next) => {
  try {
    if (req.user?.role === "seller") {
      const vendor = await User.findById(req.user._id);

      if (!vendor || vendor.status !== "active") {
        return res.status(403).json({
          message: "Your account is not active",
        });
      }
    }

    next();
  } catch (error) {
    console.error("Vendor check error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = checkVendorActive;