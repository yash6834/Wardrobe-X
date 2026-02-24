const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/Registration");
const sendEmail = require("../Utils/sendEmail");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        memberships: user.memberships || [],
      },
    });

  } catch (err) {
    console.error("GET ME ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};



// ===== Forgot Password =====
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate a reset token valid for 15 minutes
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Send reset link to user's email
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    await sendEmail(
      user.email,
      "Password Reset Request",
      `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      `
    );

    res.json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending password reset email" });
  }
};

// ===== Reset Password =====
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
