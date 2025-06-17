const express = require("express");
const { addUser, getUserById, updateUser, getAllUser } = require("../service/user");
const router = express.Router();
router.use(express.json());

router.post("/",addUser);
router.get("/:id",getUserById);
router.put("/:id",updateUser);
router.get("/",getAllUser);
module.exports = router;