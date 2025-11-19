const regisModel = require("../models/Registration");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Get users
const getuser = async (req, res) => {
  try {
    const { id, name, email, phone } = req.query;

    const query = {
      ...(id ? { _id: id } : {}),
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
      ...(phone ? { phone } : {}),
    };

    const result = await regisModel.find(query, "_id name email phone role");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error", err });
  }
};

// Register user
const adduser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ msg: "Invalid Email format." });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ msg: "Invalid Contact Number." });
    }

    if (password.length < 6 || password.length > 15) {
      return res.status(400).json({ msg: "Password must be 6-15 characters." });
    }

    const existingUser = await regisModel.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Email already registered." });

    const newUser = await regisModel.create({
      name,
      email,
      phone,
      password,
      role,
    });

    const token = generateToken(newUser._id); // Generate JWT on registration

    res.json({
      msg: "New User Added!",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error", err });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and Password are required." });
    }

    const user = await regisModel.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password." });

    const token = generateToken(user._id); // JWT token

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error", err });
  }
};



module.exports = { getuser, adduser, loginUser };
