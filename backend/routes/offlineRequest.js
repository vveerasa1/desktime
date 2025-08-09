const express = require("express");
const {
  createOfflineRequest,
  updateOfflineRequest,
  deleteOfflineTimesByUserId,
  getAllOfflineRequestByStatus,
} = require("../service/offlineRequest");
const { authenticate } = require("../utils/middleware");
const router = express.Router();

// router.use(express.json());

router.post("/", authenticate, createOfflineRequest);
router.put("/:id", authenticate, updateOfflineRequest);
router.delete("/", authenticate, deleteOfflineTimesByUserId);
router.get("/:ownerId", getAllOfflineRequestByStatus);

module.exports = router;
