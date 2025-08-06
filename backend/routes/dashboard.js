const express = require("express");
const {
  dashboardCard,
  dashboardProductivityTime,
} = require("../service/dashboard");
const { getOfflineRequests } = require("../service/offlineRequest");
const { authenticate } = require("../utils/middleware");
const router = express.Router();
router.use(express.json());

router.get("/", authenticate, dashboardCard);
router.get("/productivity", authenticate, dashboardProductivityTime);
router.get("/offlineRequest", authenticate, getOfflineRequests);

module.exports = router;
