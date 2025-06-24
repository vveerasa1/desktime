const express = require("express");
const { dashboardCard } = require("../service/dashboard");
const { authenticate } = require("../utils/middleware");
const router = express.Router();
router.use(express.json());

router.get("/", authenticate,dashboardCard);

module.exports = router;