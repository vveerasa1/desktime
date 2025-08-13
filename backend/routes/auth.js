const express = require("express");
const { login, generateToken, sendOtp, verifyOtp } = require("../service/auth");
const router = express.Router();
router.use(express.json());
router.post("/login", login);
router.post("/refresh", generateToken);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

module.exports = router;
