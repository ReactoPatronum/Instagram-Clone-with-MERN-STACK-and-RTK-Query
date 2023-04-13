const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const makeComment = asyncHandler(async (req, res) => {
  try {
    const { _id, username, profilePicture } = req.user;
    const { message, postId } = req.body;
    const post = await Post.findById(postId);
    const comment = new Comment({
      userId: _id,
      username: username,
      text: message,
      profilPhoto: profilePicture,
    });
    post.comments.push(comment);
    await post.save();
    res.status(200).json({ isSuccess: true, comment });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  try {
    const { postId, commentId, userId } = req.body;
    const { _id } = req.user;
    const ObjectId = mongoose.Types.ObjectId;
    const convertUserId = new ObjectId(userId); //yapılan yorum sahibine ait mi kontrol etmek için object id ye çevir
    const post = await Post.findById(postId);

    const commentIndex = post.comments.findIndex(
      (comment) => comment._id == commentId
    );
    //yapılan yorumun yorum dizisindeki yerini bul

    if (commentIndex !== -1 && convertUserId.equals(_id)) {
      post.comments.splice(commentIndex, 1); //bir yorum varsa ve sahibine ait ise yorumu splice metodu ile sil
      await post.save();
      res
        .status(200)
        .json({ isSuccess: true, message: "Yorum başarıyla silindi" });
    } else if (commentIndex === -1) {
      res.status(404).json({ message: "Böyle bir yorum bulunamadı" });
      return;
    } else if (convertUserId !== _id) {
      res
        .status(403)
        .json({ message: "Yorumu sadece yorum sahibi silebilir!" });
      return;
    } else {
      res.status(500).json({ message: "Bir hata meydana geldi" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const likeComment = asyncHandler(async (req, res) => {
  try {
    const { postId, commentId } = req.body;
    const { _id } = req.user;
    const post = await Post.findById(postId);
    const comment = post.comments.id(commentId); //gönderiye ait olan yorumu bul
    const ObjectId = mongoose.Types.ObjectId;
    const findLike = comment.likes.find((like) =>
      new ObjectId(like).equals(_id)
    ); //yorumun like dizisinde gönderilen id ye eşit olan ilk beğeniyi bul
    if (findLike) {
      comment.likes = comment.likes.filter(
        (like) => !new ObjectId(like).equals(_id)
      );
      await post.save();
      res.status(200).json({ isSuccess: true });
    } else {
      comment.likes.push(_id);
      await post.save();
      res.status(200).json({ isSuccess: true });
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { makeComment, deleteComment, likeComment };

// await post.update(
//   { "comments._id": comment._id },
//   { $pull: { "comments.$.likes": _id.toString() } }
// );
