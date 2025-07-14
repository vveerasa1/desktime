const express = require("express");
const { login, generateToken } = require("../service/auth");
const router = express.Router();
router.use(express.json());
router.post("/login", login);
router.post("/refresh", generateToken);

module.exports = router;
