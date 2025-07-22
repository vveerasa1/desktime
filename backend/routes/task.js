const express = require("express");
const {
  deleteTaskById,
  getTaskById,
  getAllTasks,
  saveTask,
} = require("../service/task");
const { authenticate } = require("../utils/middleware");
const router = express.Router();
router.use(express.json());

router.post("/", saveTask);
router.get("/:id", getTaskById);
router.delete("/:id", deleteTaskById);
router.get("/owner/:ownerId", getAllTasks);
module.exports = router;
