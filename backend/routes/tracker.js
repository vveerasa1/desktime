const express = require("express");
const { tracking, idleTimeTracker, activeTimeTracker, endSession, getUserTrackingInfo } = require("../service/tracker");
const { addScreenshot } = require("../service/screenshot");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
router.use(express.json());

router.post('/sessions',tracking);
router.get('/sessions',getUserTrackingInfo);
router.put('/sessions/idle',idleTimeTracker);
router.put('/sessions/active',activeTimeTracker);
router.post("/sessions/screenshots",upload.array('screenshot'),addScreenshot);

module.exports = router;