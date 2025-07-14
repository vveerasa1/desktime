const config = require("../config");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        code: 401,
        status: "Error",
        message: "User not found",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        code: 401,
        status: "Error",
        message: "Invalid email or password",
      });
    }

    // Token payload
    const payload = {
      userId: user._id,
      role: user.role,
      email: user.email,
      timeZone: user.timeZone,
    };

    // Generate tokens
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload); // Optional if you plan to use it
console.log("Successfully logen in" );
    // Send response
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Login successful",
      accessToken,
      refreshToken, // Optional
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        timeZone: user.timeZone,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: err.message });
  }
};
const generateToken = async (req, res) => {
  const { refreshToken } = req.body;
  console.log(refreshToken);
  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token required" });
  try {
    const decoded =  jwt.verify(refreshToken, config.auth.REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    const payload = {
      id: user._id,
      mobile: user?.mobile,
      email: user?.email,
      role: user?.role,
    };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Token created",
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (err) {
    console.log("refresh token getting error expired");
    res.status(403).json({ message: "Refresh token expired or invalid" });
  }
};

module.exports = { login, generateToken };
