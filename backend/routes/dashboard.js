const express = require("express");
const {
  dashboardCard,
  dashboardProductivityTime,
} = require("../service/dashboard");
const offlineRequestController = require("../service/offlineRequest");
const { authenticate } = require("../utils/middleware");
const router = express.Router();
router.use(express.json());

router.get("/", authenticate, dashboardCard);
router.get("/productivity", authenticate, dashboardProductivityTime);
router.get("/offlineRequest", authenticate, offlineRequestController.getOfflineRequests);

// Offline requests routes
router.post("/offlineRequest", authenticate, offlineRequestController.createOfflineRequest);
router.put("/offlineRequest/:id", authenticate, offlineRequestController.updateOfflineRequest);
router.delete("/offlineRequest", authenticate, offlineRequestController.deleteOfflineTimesByUserId);

module.exports = router;
