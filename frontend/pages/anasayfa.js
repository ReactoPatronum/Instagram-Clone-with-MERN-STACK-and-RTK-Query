/* eslint-disable @next/next/no-img-element */
import { requireAuthentication } from "@/HOC/requireAuth";
import { useGetTimelineQuery } from "@/redux/services/postServices";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useGetSuggestedUserQuery } from "@/redux/services/userService";
import { useRouter } from "next/router";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Image from "next/image";
import PostModal from "@/components/modals/PostModal";
import { setPostData } from "@/redux/slices/postModalSlice";
import Head from "next/head";
import { Divider } from "@mui/material";
import { getTimeDifference } from "@/functions/date";

export default function Anasayfa() {
  const router = useRouter();
  const [show, setShow] = useState({ id: "", status: false }); //İlgili gönderinin üstüne gelince kararma efekti
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const { data } = useGetTimelineQuery(); //takip edilen kullanıcıların gönderileri
  const { user } = useSelector((store) => store.auth);
  const { data: suggested } = useGetSuggestedUserQuery(); //önerilen kullanıcılar

  return (
    <>
      <Head>
        <title>Instagram</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/instaFavicon.png" />
      </Head>
      <div className=" mx-auto dark:bg-gray-700 mt-2 p-2 dark:text-white flex max-w-[1000px]">
        <div className="w-full  md:w-3/5 ">
          <div>
            <div className="space-y-4">
              {data?.length > 0 ? (
                data.map((post) => (
                  <div key={post._id}>
                    <div className="flex items-center">
                      <img
                        src={post.postedBy.profilPhoto}
                        alt="profil"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="mx-3 ">
                        <div className="flex items-center">
                          <h5 className="font-bold text-[13px]">
                            {post.postedBy.username}
                          </h5>
                          <VerifiedIcon
                            fontSize="small"
                            className="text-blue-500 ml-1"
                          />
                        </div>
                      </div>
                      <h5 className="text-sm text-gray-500">
                        &#x2022; &nbsp;
                        {getTimeDifference(post.createdAt)}
                      </h5>
                    </div>
                    <div
                      onMouseEnter={() =>
                        setShow({ id: post._id, status: true })
                      }
                      onMouseLeave={() => setShow({ id: "", status: false })}
                      onClick={() => {
                        dispatch(setPostData(post));
                        setOpenModal(true);
                      }}
                      className=" hover:brightness-75 transition-all duration-200 "
                    >
                      <div
                        onClick={() => {
                          router.push(`/profil/${user.username}`);
                        }}
                        className="flex items-center cursor-pointer hover:bg-gray-200 p-1 rounded-lg transition-all duration-200"
                        key={user.username}
                      ></div>
                      <Image
                        alt="post"
                        width={1000}
                        height={1000}
                        src={post.thumbnail}
                        className="cursor-pointer"
                      />
                      {show.status == true && show.id === post._id ? (
                        <div className="centerAbs text-white flex items-center space-x-5 z-50">
                          <div className="flex items-center">
                            <FavoriteIcon />
                            <h5 className="mx-1">{post?.likes?.length}</h5>
                          </div>
                          <div className="flex items-center">
                            <ChatBubbleIcon />
                            <h5 className="mx-1">{post?.comments?.length}</h5>
                          </div>
                        </div>
                      ) : null}
                      <div>
                        <h5 className="font-bold text-sm">
                          {post.likes.length} beğenme
                        </h5>
                        <h5 className="font-bold text-[13px] my-2">
                          {post.postedBy.username}
                          <span className="font-normal mx-2">{post.desc}</span>
                        </h5>
                        <h5 className="text-gray-500 text-sm font-semibold cursor-pointer">
                          {post.comments.length} yorumun hepsini gör
                        </h5>
                        <Divider className="mt-3" />
                      </div>
                      {post.postUrl.length > 1 ? (
                        <FilterNoneIcon className="absolute top-3 right-4 text-white" />
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-6 mt-10">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <PhotoCameraIcon className="scale-125" fontSize="large" />
                    <h5 className="text-2xl font-bold text-center">
                      Hiç Gönderi Yok Hemen Başkalarını Takip Etmeye Başlayın
                    </h5>
                  </div>
                </div>
              )}
            </div>
          </div>
          <PostModal open={openModal} setOpen={setOpenModal} />
        </div>
        <div className="hidden md:block p-8 px-12  ">
          <div
            onClick={() => router.push(`/profil/${user.username}`)}
            className="flex ml-1 items-center cursor-pointer w-full  p-2 "
          >
            <img
              className="rounded-full object-cover w-12 h-12"
              alt="profilPicture"
              src={user?.profilePicture}
            />
            <div className="text-sm mx-4">
              <h5 className="font-semibold">{user.username}</h5>
              <h5 className="text-gray-500">{user.username}</h5>
            </div>
          </div>
          <div className="mx-4">
            <h5 className="text-gray-500 font-semibold text-sm">
              Senin İçin Önerilenler
            </h5>
            <div className="space-y-2 mt-3">
              {suggested?.map((user) => (
                <div
                  onClick={() => {
                    router.push(`/profil/${user.username}`);
                  }}
                  className="flex items-center cursor-pointer hover:bg-gray-200 p-1 rounded-lg transition-all duration-200"
                  key={user.username}
                >
                  <img
                    src={user.profilePicture}
                    alt="profil"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="mx-3">
                    <div className="flex items-center">
                      <h5 className="font-bold text-[13px]">{user.username}</h5>
                      <VerifiedIcon
                        fontSize="small"
                        className="text-blue-500 ml-1"
                      />
                    </div>
                    <h5 className="text-gray-500 text-[13px]">
                      {user.fullName}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
