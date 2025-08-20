const express = require("express");
const {
  tracking,
  idleTimeTracker,
  activeTimeTracker,
  endSession,
  getAllActiveApps,
  getUserTrackingInfo,
  getSessionById,
  getTodaySessionByUserId,
  getAllTrackingsForToday,
  snapshot,
  addActiveApps,
} = require("../service/tracker");
const { addScreenshot } = require("../service/screenshot");
const multer = require("multer");
const { authenticate } = require("../utils/middleware");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
router.use(express.json());
router.get("/sessions/snapshot/:ownerId", snapshot);

router.post("/sessions", authenticate, tracking);
router.put("/sessions/active", activeTimeTracker);

router.get("/sessions", authenticate, getUserTrackingInfo);
router.post(
  "/sessions/active-apps",
  upload.single("screenshotAppIcon"),
  addActiveApps
);

router.put("/sessions/idle", idleTimeTracker);
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
router.get("/sessions/:sessionId/user/:userId", getAllActiveApps);

router.get("/sessions/:ownerId/today", getAllTrackingsForToday);

module.exports = router;
