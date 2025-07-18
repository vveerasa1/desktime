const express = require("express");
const {
  addUser,
  getUserById,
  updateUser,
  getAllUser,
  getScreenshotsById,
  getUser,
  deleteUser,
} = require("../service/user");
const { authenticate } = require("../utils/middleware");
const router = express.Router();
router.use(express.json());

router.post("/", addUser);
router.get("/:id", authenticate, getUserById);
router.put("/:id", authenticate, updateUser);
router.delete("/:id", authenticate, deleteUser);
router.get("/owner/:ownerId", getAllUser);
router.get("/:id/screenshots", authenticate, getScreenshotsById);
router.get("/sessions", authenticate, getUser);
module.exports = router;
