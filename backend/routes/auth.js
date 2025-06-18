const express = require("express");
const { login } = require("../service/auth");
const router = express.Router();
router.use(express.json());

router.post("/login", login);

module.exports = router;