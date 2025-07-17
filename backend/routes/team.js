const express = require("express");
const {
  addTeam,
  getAllTeams,
  deleteTeam,
  updateTeam,
  getTeamById,
} = require("../service/team");
// const { authenticate } = require("../utils/middleware");
const router = express.Router();
router.use(express.json());

router.post("/", addTeam);
router.get("/owner/:ownerId", getAllTeams);
router.get("/:id", getTeamById);
router.put("/:id", updateTeam);
router.delete("/:id", deleteTeam);

module.exports = router;
