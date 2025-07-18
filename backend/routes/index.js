const express = require("express");
const router = express.Router();

const userRoutes = require("./user");
const trackerRoutes = require("./tracker");
const authRoutes = require("./auth");
const dashboardRoutes = require("./dashboard");
const teamRoutes = require("./team");

router.use("/users", userRoutes);
router.use("/tracking", trackerRoutes);
router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/teams", teamRoutes);

module.exports = router;
