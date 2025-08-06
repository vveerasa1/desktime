const express = require("express");
const router = express.Router();

const offlineRequestRoutes = require("./offlineRequest");
const userRoutes = require("./user");
const trackerRoutes = require("./tracker");
const authRoutes = require("./auth");
const dashboardRoutes = require("./dashboard");
const teamRoutes = require("./team");
const projectRoutes = require("./project");
const taskRoutes = require("./task");

router.use("/users", userRoutes);
router.use("/tracking", trackerRoutes);
router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/teams", teamRoutes);
router.use("/projects", projectRoutes);
router.use("/task", taskRoutes);
router.use("/offlineRequest", offlineRequestRoutes);

module.exports = router;
