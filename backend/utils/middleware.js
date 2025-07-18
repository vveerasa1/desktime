const jwt = require("jsonwebtoken");
const config = require("../config");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    console.log("token : "+token)

    try {
      const decoded =  jwt.verify(token, config.auth.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      
      console.error("JWT Verification Error:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }
};

module.exports = { authenticate };
