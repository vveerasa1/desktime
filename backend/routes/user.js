const express = require("express");
const {
  addUser,
  getUserById,
  updateUser,
  getAllUser,
  getScreenshotsById,
  getUser,
  deleteUser,
  getUserByCognitoId,
  isUserExist,
  // searchUsers,
  globalLogout,
  resetPassword,
  refreshTokens
} = require("../service/user");
const { authenticate } = require("../utils/middleware");

const { validateToken } = require("../middleware/verifyCognitoJwt");

const router = express.Router();
router.use(express.json());
router.get("/exist", validateToken, isUserExist);
router.post("/refreshTokens", refreshTokens);

router.post("/", addUser);
// router.get("/:id", authenticate, getUserById);
router.get("/:id", validateToken, getUserById);
router.put("/:id", validateToken, updateUser);
router.delete("/:id", validateToken, deleteUser);
router.get("/owner/:ownerId", getAllUser);
router.get("/:id/screenshots", validateToken, getScreenshotsById);
router.get("/sessions", validateToken, getUser);
// router.get("/search/:ownerId", validateToken, searchUsers);
router.post("/reset/password", resetPassword);
router.post("/global-logout", globalLogout);

module.exports = router;
