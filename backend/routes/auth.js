const express = require("express");
const { login, generateToken } = require("../service/auth");
const router = express.Router();
router.use(express.json());
router.post("/login", login);
router.post("/auth/refresh", generateToken);

module.exports = router;
