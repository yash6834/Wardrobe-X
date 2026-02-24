const express = require("express");
const router = express.Router();
const { getMe, forgotPassword, resetPassword } = require("../controller/authController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
