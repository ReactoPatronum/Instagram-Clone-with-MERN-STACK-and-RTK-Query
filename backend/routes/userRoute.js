const express = require("express");
const {
  createUser,
  loginUser,
  getUser,
  getProfile,
  followUser,
  updateProfilePicture,
  searchUser,
  unfollowUser,
  suggestedUser,
} = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  productImgResize,
  uploadPost,
} = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/search", searchUser);
router.put("/follow", authMiddleware, followUser);
router.put("/unfollow", authMiddleware, unfollowUser);
router.get("/profile/:username", getUser);
router.get("/userprofile", authMiddleware, getProfile);
router.get("/suggestedUsers", authMiddleware, suggestedUser);
router.put(
  "/updatePicture",
  authMiddleware,
  uploadPost.array("image", 1),
  productImgResize,
  updateProfilePicture
);

module.exports = router;
