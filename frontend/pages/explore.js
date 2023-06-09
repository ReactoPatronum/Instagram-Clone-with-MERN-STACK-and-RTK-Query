import React, { useState } from "react";
import { useGetAllPostsQuery } from "@/redux/services/postServices";
import Image from "next/image";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PostModal from "@/components/modals/PostModal";
import { useDispatch } from "react-redux";
import { setPostData } from "@/redux/slices/postModalSlice";
import { CircularProgress } from "@mui/material";
import Head from "next/head";

export default function Explore() {
  const [show, setShow] = useState({ id: "", status: false });
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const { data, isLoading } = useGetAllPostsQuery();
  return (
    <div>
      <Head>
        <title>Instagram</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/instaFavicon.png" />
      </Head>
      <div>
        <div className="grid grid-cols-6 p-2 mt-4 gap-10">
          {!isLoading ? (
            data?.map((post) => (
              <div
                onMouseEnter={() => setShow({ id: post._id, status: true })}
                onMouseLeave={() => setShow({ id: "", status: false })}
                key={post._id}
                onClick={() => {
                  dispatch(setPostData(post));
                  setOpenModal(true);
                }}
                className="col-span-6 md:col-span-2 relative hover:brightness-75 transition-all duration-200 cursor-pointer"
              >
                <Image
                  alt="post"
                  width={1000}
                  height={1000}
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
              <div className="flex items-center justify-center flex-col h-screen">
                <CircularProgress />
                <h5>Lütfen Bekleyiniz.</h5>
              </div>
            </div>
          )}
        </div>
      </div>
      <PostModal open={openModal} setOpen={setOpenModal} />
    </div>
  );
}
