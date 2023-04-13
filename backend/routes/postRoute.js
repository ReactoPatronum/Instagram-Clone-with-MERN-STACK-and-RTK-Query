const express = require("express");
const {
  createPost,
  getUserPosts,
  likePost,
  getAllPosts,
  getTimeline,
} = require("../controllers/postController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  productImgResize,
  uploadPost,
} = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  uploadPost.array("image", 10),
  productImgResize,
  createPost
);

router.get("/userpost/:username", getUserPosts);
router.get("/allPost", getAllPosts);
router.get("/getTimeline", authMiddleware, getTimeline);
router.post("/likePost", authMiddleware, likePost);

module.exports = router;
