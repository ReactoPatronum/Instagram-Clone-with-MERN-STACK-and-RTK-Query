import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const comment_Service = createApi({
  reducerPath: "comment_Service",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://insta-clone-api.onrender.com",
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints(builder) {
    return {
      addComment: builder.mutation({
        query: (args) => {
          return {
            url: "comment/add",
            method: "POST",
            body: args,
          };
        },
      }),
      deleteComment: builder.mutation({
        query: (args) => {
          return {
            url: "comment/remove",
            method: "DELETE",
            body: args,
          };
        },
      }),
      likeComment: builder.mutation({
        query: (args) => {
          return {
            url: "comment/like",
            method: "PUT",
            body: args,
          };
        },
      }),
    };
  },
});

export const {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
} = comment_Service;
