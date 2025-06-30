const express = require("express");
const { addUser, getUserById, updateUser, getAllUser, getScreenshotsById, getUser } = require("../service/user");
const { authenticate } = require("../utils/middleware");
const router = express.Router();
router.use(express.json());

router.post("/",addUser);
router.get("/:id",getUserById);
router.put("/:id",updateUser);
router.get("/",getAllUser);
router.get("/:id/screenshots",getScreenshotsById);
router.get("/sessions",authenticate,getUser);
module.exports = router;