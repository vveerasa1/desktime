const express = require("express");
const {
  deleteTaskById,
  getTaskById,
  getAllTasks,
  saveTask,
  searchTasks
} = require("../service/task");
const { authenticate } = require("../utils/middleware");
const router = express.Router();
router.use(express.json());

router.post("/", saveTask);
router.get("/:id", getTaskById);
router.delete("/:id", deleteTaskById);
router.get("/owner/:ownerId", getAllTasks);
router.get('/search/:ownerId',searchTasks)
module.exports = router;
