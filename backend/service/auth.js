const config = require("../config");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const nodemailer = require("nodemailer");
const { handleRefreshToken } = require("../utils/cognito");

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
    // const decoded = jwt.verify(refreshToken, config.auth.REFRESH_SECRET);
    // console.log(decoded);
    // req.user = decoded;

    // const user = await User.findById(decoded.userId);

    // const payload = {
    //   userId: user._id,
    //   ownerId: user.ownerId,
    //   role: user.role,
    //   email: user.email,
    //   timeZone: user.timeZone,
    // };
    // console.log("payload :" + payload);
    const tokens = await handleRefreshToken(refreshToken, config.cognito.clientId);
    console.log("payload :" + tokens);

    // // const newAccessToken = generateAccessToken(payload);
    // // const newRefreshToken = generateRefreshToken(payload);

    // console.log("newAccessToken :" + newAccessToken);
    // console.log("newRefreshToken :" + newRefreshToken);

    console.log("payload");

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Token created",
      // tokens,
      data: { accessToken: tokens?.IdToken,
        //  refreshToken: newRefreshToken
         },
    });
  } catch (err) {
    console.log("refresh token getting error expired",err);
    res.status(403).json({ message: "Refresh token expired or invalid" });
  }
};
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email, isDeleted: false });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send email directly here

    const transporter = nodemailer.createTransport({
      service: config.smtp?.service,
      auth: {
        user: config.smtp?.email,
        pass: config.smtp?.password,
      },
    });

    const mailOptions = {
      from: config.smtp?.email,
      to: user.email,
      subject: "TrackMe - Password Update OTP",
      text: `Hi ${user.username},

We received a request to update your TrackMe account password.

Your One-Time Password (OTP) is:
${otp}

This OTP will expire in 10 minutes. Please use it to complete your password update.

If you did not request a password change, please ignore this email.

***** This is an auto-generated email. Please do not reply. *****

Best regards,
TrackMe - Pentabay Team`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Email error for", email, ":", error.message);
      }
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "OTP sent successfully",
      data: null,
    });
  } catch (error) {
    console.error("Error in addUser:", error);
    return res.status(500).json({
      code: 500,
      status: "Error",
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, isDeleted: false });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      !user.otp ||
      user.otp !== otp ||
      !user.otpExpires ||
      user.otpExpires < Date.now()
    ) {
      throw new CustomError("Invalid or expired OTP", 400);
    }
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return res.status(200).json({
      code: 200,
      status: "success",
      message: "OTP verified successfully",
      data: null,
    });
  } catch (error) {
    console.error("Error in addUser:", error);
    return res.status(500).json({
      code: 500,
      status: "Error",
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};

module.exports = { login, generateToken, sendOtp, verifyOtp };
