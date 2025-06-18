const express = require("express");
const { addUser, getUserById, updateUser, getAllUser, getScreenshotsById } = require("../service/user");
const { authenticate } = require("../utils/middleware");
const router = express.Router();
router.use(express.json());

router.post("/",addUser);
router.get("/:id",getUserById);
router.put("/:id",updateUser);
router.get("/",getAllUser);
router.get("/:id/screenshots",getScreenshotsById);
module.exports = router;