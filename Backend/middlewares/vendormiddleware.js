const jwt = require("jsonwebtoken");
const regisModel = require("../models/Registration");

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach decoded info
    req.auth = decoded; // { id, role }

    // full user document (optional but useful)
    req.user = await regisModel
      .findById(decoded.id)
      .select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

module.exports = protect;
