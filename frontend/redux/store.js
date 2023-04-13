import { configureStore } from "@reduxjs/toolkit";
import { user_Service } from "./services/userService";
import { post_Service } from "./services/postServices";
import authSlice from "./slices/authSlice";
import { comment_Service } from "./services/commentService";
import postModalSlice from "./slices/postModalSlice";
import searchModalSlice from "./slices/searchModalSlice";

const store = configureStore({
  reducer: {
    [user_Service.reducerPath]: user_Service.reducer,
    [post_Service.reducerPath]: post_Service.reducer,
    [comment_Service.reducerPath]: comment_Service.reducer,
    auth: authSlice,
    postModal: postModalSlice,
    searchModal: searchModalSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      user_Service.middleware,
      post_Service.middleware,
      comment_Service.middleware,
    ]),
});

export default store;
