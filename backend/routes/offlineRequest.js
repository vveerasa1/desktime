const express = require("express");
const {
  createOfflineRequest,
  updateOfflineRequest,
  deleteOfflineTimesByUserId,
  getAllOfflineRequestByStatus,
} = require("../service/offlineRequest");
const router = express.Router();
const { validateToken } = require("../middleware/verifyCognitoJwt");

// router.use(express.json());

router.post("/", validateToken, createOfflineRequest);
router.put("/:id", validateToken, updateOfflineRequest);
router.delete("/", validateToken, deleteOfflineTimesByUserId);
router.get("/:ownerId", getAllOfflineRequestByStatus);

module.exports = router;
