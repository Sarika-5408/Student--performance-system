const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// 🟢 REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });

    res.json({
      success: true,
      message: "User registered",
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// 🟢 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password"
      });
    }

    // ✅ USE SAME SECRET AS MIDDLEWARE
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;