/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { Carousel } from "react-responsive-carousel";
import { Divider } from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { useLikePostMutation } from "@/redux/services/postServices";
import { style } from "../../styles/style";
import { useDispatch, useSelector } from "react-redux";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { toast } from "react-toastify";
import InputComment from "../InputComment";
import { convertDate, getTimeDifference } from "@/functions/date";
import PostComments from "../PostComments";
import { updatePostLikes } from "@/redux/slices/postModalSlice";

//gönderiye tıklanıldığında açılan modal yorum ve beğeni istekleri buradan gerçekleşiyor.

export default function PostModal({ open, setOpen }) {
  const { user } = useSelector((store) => store.auth);
  const { post } = useSelector((store) => store.postModal);
  const dispatch = useDispatch();
  const [likePost] = useLikePostMutation();

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade
          className="w-11/12 h-11/12 md:h-4/5 md:w-4/5 p-0 border-none dark:bg-gray-700 dark:text-white"
          in={open}
        >
          <Box sx={style}>
            <div className="grid grid-cols-6 ">
              <div className="col-span-6 md:col-span-3 lg:col-span-4 bg-black">
                <Carousel showArrows showStatus={false} showThumbs={false}>
                  {post?.postUrl?.map((image, i) => (
                    <img
                      key={i}
                      className="object-contain lg:object-cover h-[calc(40vh)] md:h-[calc(80vh)] w-full "
                      src={image.url}
                      alt="postImage"
                    />
                  ))}
                </Carousel>
              </div>
              <div className="col-span-6 md:col-span-3 lg:col-span-2 dark:bg-gray-700 bg-white relative">
                <div className="flex items-center p-3  h-[calc(6vh)] ">
                  <img
                    src={post.postedBy.profilPhoto}
                    alt="profil"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <h5 className="text-xs font-bold mx-2">
                    {post?.postedBy?.username}
                  </h5>
                </div>
                <Divider />
                <div className="h-[calc(28vh)] md:h-[calc(59vh)] overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start p-3 ">
                      <img
                        src={post.postedBy.profilPhoto}
                        alt="profil"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h5 className="text-xs font-bold mx-2">
                          {post?.postedBy?.username}
                        </h5>
                        <h5 className="mx-2 font-normal text-[13px] leading-[16px]">
                          {post.desc}
                        </h5>
                        <div className="flex mt-1 mx-2 items-center text-xs text-gray-400 space-x-3">
                          <h5>{getTimeDifference(post.createdAt)}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                  <PostComments />
                </div>
                <Divider />
                <div className="py-2 px-4 md:h-[calc(9vh)] ">
                  <div className="space-x-3">
                    {post?.likes?.includes(user?._id) ? (
                      <FavoriteIcon
                        className="cursor-pointer text-red-500 favorite-icon"
                        onClick={() => {
                          likePost(post._id)
                            .then(() => {
                              let newLikes = post?.likes?.filter(
                                (like) => like !== user._id
                              );
                              dispatch(updatePostLikes(newLikes));
                            })
                            .catch((error) => {
                              console.log(error);
                              toast.error(error.data.message);
                            });
                        }}
                      />
                    ) : (
                      <FavoriteBorderOutlinedIcon
                        className="cursor-pointer favorite-icon"
                        onClick={() => {
                          likePost(post._id)
                            .then(() => {
                              let newLikes = post?.likes?.concat(user._id);
                              dispatch(updatePostLikes(newLikes));
                            })
                            .catch((error) => {
                              console.log(error);
                              toast.error(error.data.message);
                            });
                        }}
                      />
                    )}
                    <ChatBubbleOutlineOutlinedIcon />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold my-1">
                      {post?.likes?.length} beğenme
                    </h5>
                    <h5 className="text-xs text-gray-400  font-semibold">
                      {convertDate(post.createdAt)}
                    </h5>
                  </div>
                </div>
                <Divider />
                <InputComment />
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
