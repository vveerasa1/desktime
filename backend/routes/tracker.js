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
const { validateToken } = require("../middleware/verifyCognitoJwt");

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
router.use(express.json());
router.get("/sessions/snapshot/:ownerId", snapshot);

router.post("/sessions", validateToken, tracking);
router.get("/sessions", validateToken, getUserTrackingInfo);
router.put("/sessions/idle",validateToken, idleTimeTracker);
router.put("/sessions/active",validateToken, activeTimeTracker);
router.post("/sessions/screenshots",   upload.fields([
    { name: "screenshot", maxCount: 1 },
    { name: "screenshotAppIcon", maxCount: 1 },
  ]),
  addScreenshot);
router.get("/sessions/:id", getSessionById);
router.get("/sessions/user/:userId/today", validateToken, getTodaySessionByUserId);
router.get("/sessions/:ownerId/today", getAllTrackingsForToday);

router.get("/sessions/:sessionId/user/:userId", getAllActiveApps);


module.exports = router;
