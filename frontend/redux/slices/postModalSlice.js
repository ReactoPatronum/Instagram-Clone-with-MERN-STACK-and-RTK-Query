import { createSlice } from "@reduxjs/toolkit";

const post = {
  comments: [],
  desc: "",
  postUrl: [],
  createdAt: "",
  likes: [],
  postedBy: [],
  thumbnail: "",
  _id: "",
  updatedAt: "",
};

const postModalSlice = createSlice({
  name: "postModal",
  initialState: {
    post,
  },
  reducers: {
    setPostData: (state, action) => {
      state.post = action.payload;
    },
    resetPostData: (state, action) => {
      state.post = post;
    },
    updatePostComments: (state, action) => {
      state.post.comments = action.payload;
    },
    updatePostCommentLikes: (state, action) => {
      state.post.comments[action.payload.index].likes = action.payload.data;
    },
    updatePostLikes: (state, action) => {
      state.post.likes = action.payload;
    },
  },
});

export const {
  setPostData,
  resetPostData,
  updatePostComments,
  updatePostLikes,
  updatePostCommentLikes,
} = postModalSlice.actions;

export default postModalSlice.reducer;
