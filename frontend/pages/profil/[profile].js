/* eslint-disable @next/next/no-img-element */
import { useGetUserPostsQuery } from "@/redux/services/postServices";
import {
  useFollowMutation,
  useGetUserQuery,
} from "@/redux/services/userService";
import { CircularProgress, IconButton } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PostModal from "@/components/modals/PostModal";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "@/redux/slices/postModalSlice";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Link from "next/link";
import { toast } from "react-toastify";
import UpdateProfilPicture from "../../components/modals/UpdateProfilPicture";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Head from "next/head";

export default function Profile({ profile }) {
  const { user } = useSelector((store) => store.auth);
  const [show, setShow] = useState({ id: "", status: false });
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const { data, isLoading } = useGetUserPostsQuery(profile);
  const { data: userData, refetch } = useGetUserQuery(profile);
  const [follow] = useFollowMutation();

  //kullanıcıyı takip et
  const handleFollow = async () => {
    await follow({ secondUser: profile })
      .unwrap()
      .then((res) => {
        console.log("cevap", res);
        if (res.isSuccess) {
          toast.success(res.message);
          refetch();
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.data.message);
      });
  };

  return (
    <>
      <Head>
        <title>Instagram</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/instaFavicon.png" />
      </Head>
      {!isLoading ? (
        userData ? (
          <div className="flex flex-col items-center  min-h-screen">
            <div className="flex items-center py-6 space-x-4 sm:space-x-10">
              <div className="flex items-center flex-col">
                {user.username === profile ? (
                  <UpdateProfilPicture
                    refetch={refetch}
                    profile={profile}
                    picture={userData.user.profilePicture ?? ""}
                  />
                ) : (
                  <img
                    className="rounded-full object-cover w-20 h-20 sm:w-28 sm:h-28"
                    alt="profilePicture"
                    src={userData.user.profilePicture}
                  />
                )}
              </div>
              <div className="text-sm sm:text-base">
                <div className="flex items-center">
                  {userData.user.username ?? "kullanıcı"}
                  <button
                    onClick={handleFollow}
                    className="bg-blue-500 p-1 px-5 text-white mx-4 rounded-lg hidden sm:block"
                  >
                    {user?.followings.includes(profile)
                      ? "Takiptesin"
                      : "Takip Et"}
                  </button>
                  <IconButton
                    onClick={handleFollow}
                    color="primary"
                    aria-label="add to shopping cart"
                    className="mx-2 sm:hidden"
                  >
                    <PersonAddIcon />
                  </IconButton>
                </div>
                <div className="flex space-x-5 my-2">
                  <h5>
                    <span className="font-semibold">
                      {data?.length ?? 0}&nbsp;
                    </span>
                    Gönderi
                  </h5>
                  <h5>
                    <span className="font-semibold">
                      {userData.user.followers.length ?? 0}&nbsp;
                    </span>
                    Takipçi
                  </h5>
                  <h5>
                    <span className="font-semibold">
                      {userData.user.followings.length ?? 0}&nbsp;
                    </span>
                    Takip
                  </h5>
                </div>
                <h5 className="font-semibold text-sm">
                  <span>{userData.user.fullName ?? "Kullanıcı"}</span>
                </h5>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-6 p-2 mt-10 gap-10">
                {data?.length > 0 ? (
                  data.map((post) => (
                    <div
                      onMouseEnter={() =>
                        setShow({ id: post._id, status: true })
                      } //eğer postun id si state id sine eşit ise ve status true ise kararma efekti uygula
                      onMouseLeave={() => setShow({ id: "", status: false })}
                      key={post._id}
                      onClick={() => {
                        dispatch(setPostData(post));
                        setOpenModal(true);
                      }}
                      className="col-span-6 md:col-span-3 relative hover:brightness-75 transition-all duration-200 cursor-pointer"
                    >
                      <Image
                        alt="post"
                        width={500}
                        height={500}
                        src={post.thumbnail}
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
                      {post.postUrl.length > 1 ? (
                        <FilterNoneIcon className="absolute top-3 right-4 text-white" />
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="col-span-6 mt-10">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <PhotoCameraIcon className="scale-125" fontSize="large" />
                      <h5 className="text-2xl font-bold">
                        Henüz Hiç Gönderi Yok
                      </h5>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <PostModal open={openModal} setOpen={setOpenModal} />
          </div>
        ) : (
          <div className="flex flex-col mt-10 items-center p-5 text-center">
            <h5 className="font-bold text-lg my-4">
              Üzgünüz , aradığınız kişiye ulaşılamıyor
            </h5>
            <h5>
              Tıkladığın bağlantı bozuk olabilir veya sayfa kaldırılmış
              olabilir.
              <Link href="/anasayfa">Instagrama</Link> geri dön.
            </h5>
          </div>
        )
      ) : (
        <div className="flex items-center justify-center flex-col h-screen">
          <CircularProgress />
          <h5>Lütfen Bekleyiniz.</h5>
        </div>
      )}
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { profile } = context.query;
  return {
    props: {
      profile,
    },
  };
};
