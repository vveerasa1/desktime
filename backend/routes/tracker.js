const express = require("express");
const {
  tracking,
  idleTimeTracker,
  activeTimeTracker,
  endSession,
  getUserTrackingInfo,
  getSessionById,
  getTodaySessionByUserId,
  getAllTrackingsForToday,
} = require("../service/tracker");
const { addScreenshot } = require("../service/screenshot");
const multer = require("multer");
const { validateToken } = require("../middleware/verifyCognitoJwt");

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
router.use(express.json());

router.post("/sessions", validateToken, tracking);
router.get("/sessions", validateToken, getUserTrackingInfo);
router.put("/sessions/idle",validateToken, idleTimeTracker);
router.put("/sessions/active",validateToken, activeTimeTracker);
router.post("/sessions/screenshots", upload.array("screenshot"), addScreenshot);
router.get("/sessions/:id", getSessionById);
router.get("/sessions/user/:userId/today", validateToken, getTodaySessionByUserId);
router.get("/sessions/:ownerId/today", getAllTrackingsForToday);

module.exports = router;
