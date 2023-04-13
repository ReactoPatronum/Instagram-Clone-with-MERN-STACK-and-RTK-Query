import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const user_Service = createApi({
  reducerPath: "user_Service",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://insta-clone-api-ijhp.onrender.com",
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
      getUser: builder.query({
        query: (args) => {
          return {
            url: `user/profile/${args}`,
            method: "GET",
          };
        },
      }),
      getProfile: builder.query({
        query: () => {
          return {
            url: `user/userprofile`,
            method: "GET",
          };
        },
      }),
      createUser: builder.mutation({
        query: (args) => ({
          url: "user/register",
          method: "POST",
          body: args,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }),
      }),
      login: builder.mutation({
        query: (args) => ({
          url: "user/login",
          method: "POST",
          body: args,
        }),
      }),
      follow: builder.mutation({
        query: (args) => ({
          url: "user/follow",
          method: "PUT",
          body: args,
        }),
      }),
      updateProfilPicture: builder.mutation({
        //kullanıcının username'i ve resmi gönder
        query: ({ image, profile }) => {
          const formData = new FormData();
          formData.append("image", image);
          formData.append("data", profile);
          return {
            url: `user/updatePicture`,
            method: "PUT",
            body: formData,
          };
        },
      }),
      searchUser: builder.mutation({
        query: (args) => ({
          url: "user/search",
          method: "POST",
          body: args,
        }),
      }),
      getSuggestedUser: builder.query({
        query: () => {
          return {
            url: `user/suggestedUsers`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const {
  useCreateUserMutation,
  useGetUserQuery,
  useLoginMutation,
  useGetProfileQuery,
  useFollowMutation,
  useUpdateProfilPictureMutation,
  useSearchUserMutation,
  useGetSuggestedUserQuery,
} = user_Service;
