const express = require("express");
const {
  addTeam,
  getAllTeams,
  deleteTeam,
  updateTeam,
  getTeamById,
  searchTeams
} = require("../service/team");
const router = express.Router();
router.use(express.json());

router.post("/", addTeam);
router.get("/owner/:ownerId", getAllTeams);
router.get("/:id", getTeamById);
router.put("/:id", updateTeam);
router.delete("/:id", deleteTeam);
router.get("/search/:ownerId", searchTeams);
module.exports = router;
