const express = require("express");
const {
  dashboardCard,
  dashboardProductivityTime,
} = require("../service/dashboard");
const { authenticate } = require("../utils/middleware");
const { validateToken } = require("../middleware/verifyCognitoJwt");

const router = express.Router();
router.use(express.json());

router.get("/", validateToken, dashboardCard);
router.get("/productivity", authenticate, dashboardProductivityTime);
module.exports = router;
