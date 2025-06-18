const jwt = require("jsonwebtoken");
const config = require("../config");

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if(!authHeader){
      return res.status(401).json({ message: "No token provided" });
    }
  
    if (authHeader?.startsWith("Bearer ")) {
  
    const token = authHeader.split(" ")[1];
  
    try {
      const decoded = jwt.verify(token, config.auth.JWT_SECRET);
      req.user = decoded;
      console.log("[Authenticated User]:", decoded);
      next();
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
  }
  };
  
  module.exports = { authenticate };  