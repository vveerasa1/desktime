const jwt = require("jsonwebtoken");
const config = require("../config");

const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.auth.JWT_SECRET, { expiresIn: "1m" });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.auth.REFRESH_SECRET, { expiresIn: "7d" });
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.auth.REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
