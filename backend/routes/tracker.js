const express = require("express");
const { tracking, idleTimeTracker, activeTimeTracker, endSession, getUserTrackingInfo } = require("../service/tracker");
const router = express.Router();
router.use(express.json());

router.post('/session',tracking);
router.get('/session',getUserTrackingInfo);
router.put('/session/idle',idleTimeTracker);
router.put('/session/active',activeTimeTracker);
router.put('/session/end',endSession);

module.exports = router;