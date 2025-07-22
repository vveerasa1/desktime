const express = require("express");
const {
  deleteProjectById,
  getProjectById,
  getAllProjects,
  saveProject,
} = require("../service/project");
const { authenticate } = require("../utils/middleware");
const router = express.Router();
router.use(express.json());

router.post("/", saveProject);
router.get("/:id", getProjectById);
router.delete("/:id", deleteProjectById);
router.get("/", getAllProjects);
module.exports = router;
