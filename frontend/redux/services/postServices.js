import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const post_Service = createApi({
  reducerPath: "post_Service",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api/",
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints(builder) {
    //resmi ve açıklamayı gönder
    return {
      createPost: builder.mutation({
        query: ({ images, description }) => {
          const formData = new FormData();
          formData.append("data", description);
          for (let i = 0; i < images.length; i++) {
            formData.append("image", images[i]);
          }
          return {
            url: `post/create`,
            method: "POST",
            body: formData,
          };
        },
      }),
      getUserPosts: builder.query({
        query: (args) => {
          return {
            url: `post/userpost/${args}`,
            method: "GET",
          };
        },
      }),
      likePost: builder.mutation({
        query: (id) => {
          return {
            url: "post/likePost",
            method: "POST",
            body: { id },
          };
        },
      }),
      getAllPosts: builder.query({
        query: () => {
          return {
            url: `post/allPost`,
            method: "GET",
          };
        },
      }),
      getTimeline: builder.query({
        query: () => {
          return {
            url: `post/getTimeline`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const {
  useCreatePostMutation,
  useGetUserPostsQuery,
  useLikePostMutation,
  useGetAllPostsQuery,
  useGetTimelineQuery,
} = post_Service;
