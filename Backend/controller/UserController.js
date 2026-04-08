const regisModel = require("../models/Registration");
const jwt = require("jsonwebtoken");

// ================= TOKEN =================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ================= GET USERS (ADMIN) =================
const getuser = async (req, res) => {
  try {
    const { id, name, email, phone } = req.query;

    const query = {
      ...(id ? { _id: id } : {}),
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
      ...(phone ? { phone } : {}),
    };

    const users = await regisModel.find(
      query,
      "_id name email phone role brandName memberships"
    );

    // 🔥 attach activeMembership for each user
    const result = users.map((user) => {
      const activeMembership =
        user.memberships?.find(
          (m) => m.isActive && new Date(m.endDate) > new Date()
        ) || null;

      return {
        ...user.toObject(),
        activeMembership,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// ================= REGISTER =================
const adduser = async (req, res) => {
  try {
    const { name, email, phone, password, role, brandName } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    if (role === "seller" && !brandName) {
      return res
        .status(400)
        .json({ msg: "Brand name is required for seller." });
    }

    const existingUser = await regisModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered." });
    }

    const newUser = await regisModel.create({
      name,
      email,
      phone,
      password,
      role,
      brandName: role === "seller" ? brandName : undefined,
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      msg: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        brandName: newUser.brandName,
        memberships: newUser.memberships || [],
        activeMembership: null, // new user has none
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and Password are required." });
    }

    const user = await regisModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password." });
    }

    // 🔴 ADD THIS BLOCK HERE
    if (user.status === "deactivated") {
      return res.status(403).json({
        msg: "Your account has been deactivated by admin",
      });
    }

    // 🟡 OPTIONAL (for suspend)
    if (user.status === "suspended") {
      return res.status(403).json({
        msg: "Your account is temporarily suspended",
      });
    }

    // ✅ THEN GENERATE TOKEN
    const token = generateToken(user._id);

    // 🔥 ACTIVE MEMBERSHIP (BACKEND TRUTH)
    const activeMembership =
      user.memberships?.find(
        (m) => m.isActive && new Date(m.endDate) > new Date()
      ) || null;

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status, // ✅ IMPORTANT (send this)
        memberships: user.memberships || [],
        activeMembership,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

// ================= GET PROFILE =================
const getUserProfile = async (req, res) => {
  try {
    const user = await regisModel
      .findById(req.user._id)
      .select("-password");

    if (!user) {
      return res.status(404).json({ success: false });
    }

    const activeMembership =
      user.memberships?.find(
        (m) => m.isActive && new Date(m.endDate) > new Date()
      ) || null;

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        activeMembership,
      },
    });
  } catch (err) {
    res.status(401).json({ success: false });
  }
};

module.exports = {
  getuser,
  adduser,
  loginUser,
  getUserProfile,
};
