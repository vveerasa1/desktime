const express = require("express");
const {
  addTeam,
  getAllTeams,
  deleteTeam,
  updateTeam,
} = require("../service/team");
// const { authenticate } = require("../utils/middleware");
const router = express.Router();
router.use(express.json());

router.post("/", addTeam);
router.get("/owner/:ownerId", getAllTeams);
router.put("/:id", updateTeam);
router.delete("/:id", deleteTeam);

module.exports = router;
