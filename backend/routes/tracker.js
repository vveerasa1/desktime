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
  searchTrackings,
} = require("../service/tracker");
const { addScreenshot } = require("../service/screenshot");
const multer = require("multer");
const { authenticate } = require("../utils/middleware");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
router.use(express.json());

router.post("/sessions", authenticate, tracking);
router.get("/sessions", authenticate, getUserTrackingInfo);
router.put("/sessions/idle", idleTimeTracker);
router.put("/sessions/active", activeTimeTracker);
router.post(
  "/sessions/screenshots",
  upload.fields([
    { name: "screenshot", maxCount: 1 },
    { name: "screenshotAppIcon", maxCount: 1 },
  ]),
  addScreenshot
);
router.get("/sessions/:id", getSessionById);
router.get("/sessions/user/:userId/today", getTodaySessionByUserId);
router.get("/sessions/:ownerId/today", getAllTrackingsForToday);

module.exports = router;
