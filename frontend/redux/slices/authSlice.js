import { createSlice } from "@reduxjs/toolkit";

const user = {
  email: "",
  followers: [],
  followings: [],
  fullName: "",
  profilePicture: "",
  username: "",
  _id: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload;
    },
    logOut: (state, action) => {
      state.user = null;
    },
    setProfilPicture: (state, action) => {
      state.user.profilePicture = action.payload;
    },
    setFollowers: (state, action) => {
      state.user.followers = action.payload;
    },
    setFollowings: (state, action) => {
      state.user.followings = action.payload;
    },
  },
});

export const {
  logOut,
  setUserData,
  setFollowers,
  setFollowings,
  setProfilPicture,
} = authSlice.actions;
export default authSlice.reducer;
