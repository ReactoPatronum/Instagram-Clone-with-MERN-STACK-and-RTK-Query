const Post = require("../models/postModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { cloudinaryUploadImage } = require("../utils/cloudinary");

const createPost = asyncHandler(async (req, res) => {
  const { _id, username, profilePicture } = req.user;
  const description = req.body.data;
  try {
    const uploader = (path) => cloudinaryUploadImage(path, "image");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
    }
    const newPost = await Post.create({
      postedBy: { id: _id, username: username, profilPhoto: profilePicture },
      postUrl: urls,
      desc: description,
      thumbnail: urls[0].url,
    });
    res.status(200).json({ isSuccess: true, post: newPost });
  } catch (error) {
    throw new Error(error);
  }
});

const likePost = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { id } = req.body;
  try {
    const post = await Post.findById(id);
    if (!post.likes.includes(_id)) {
      await post.updateOne({ $push: { likes: _id } });
      res.status(200).json("Gönderi Beğenildi");
    } else {
      await post.updateOne({ $pull: { likes: _id } });
      res.status(200).json("Gönderideki Beğeni Silindi.");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

const getUserPosts = asyncHandler(async (req, res) => {
  try {
    const { username } = req.params;
    const userPosts = await Post.find({ "postedBy.username": username });
    if (userPosts.length > 0) {
      res.status(200).json(userPosts);
    } else {
      res.status(404).json(userPosts);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getAllPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    throw new Error(error);
  }
});

const getTimeline = asyncHandler(async (req, res) => {
  try {
    const { username } = req.user;
    const user = await User.findOne({ username });
    const userPosts = await Post.find({ "postedBy.username": username }).sort({
      createdAt: -1,
    }); //kullanıcıların gönderileri

    const followingPosts = await Promise.all(
      user.followings.map((username) => {
        return Post.find({ "postedBy.username": username }).sort({
          createdAt: -1,
        });
      })
    ); //takip edilen kullanıcıların gönderileri
    res.status(200).json(userPosts.concat(...followingPosts));
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createPost,
  getUserPosts,
  likePost,
  getAllPosts,
  getTimeline,
};
