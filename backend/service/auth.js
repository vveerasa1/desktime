const config = require("../config");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email, isDeleted: false });
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
      ownerId: user.ownerId,
      role: user.role,
      email: user.email,
      timeZone: user.timeZone,
    };

    // Generate tokens
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    user.active = true;
    await user.save();

    user.active = true;
    await user.save();

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
  console.log("inBackend :" + refreshToken);
  console.log(config.auth.REFRESH_SECRET);
  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token required" });
  try {
    // const decoded = await verifyRefreshToken(refreshToken);
    const decoded = jwt.verify(refreshToken, config.auth.REFRESH_SECRET);
    console.log(decoded);
    // req.user = decoded;

    const user = await User.findById(decoded.userId);

    const payload = {
      userId: user._id,
      ownerId: user.ownerId,
      role: user.role,
      email: user.email,
      timeZone: user.timeZone,
    };
    console.log("payload :" + payload);

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    console.log("newAccessToken :" + newAccessToken);
    console.log("newRefreshToken :" + newRefreshToken);

    console.log();

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
