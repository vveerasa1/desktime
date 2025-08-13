const express = require("express");
const {
  deleteProjectById,
  getProjectById,
  getAllProjects,
  saveProject,
  searchProjects
} = require("../service/project");

const router = express.Router();
router.use(express.json());

router.post("/", saveProject);
router.get("/:id", getProjectById);
router.delete("/:id", deleteProjectById);
router.get("/owner/:ownerId", getAllProjects);
router.get("/search/:ownerId", searchProjects);

module.exports = router;
