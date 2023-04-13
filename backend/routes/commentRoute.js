const express = require("express");
const {
  makeComment,
  deleteComment,
  likeComment,
} = require("../controllers/commentController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, makeComment);
router.delete("/remove", authMiddleware, deleteComment);
router.put("/like", authMiddleware, likeComment);

module.exports = router;
