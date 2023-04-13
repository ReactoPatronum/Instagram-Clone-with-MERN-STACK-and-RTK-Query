/* eslint-disable @next/next/no-img-element */
import React from "react";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { getTimeDifference } from "@/functions/date";
import { useDispatch, useSelector } from "react-redux";
import {
  useDeleteCommentMutation,
  useLikeCommentMutation,
} from "@/redux/services/commentService";
import { toast } from "react-toastify";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  updatePostCommentLikes,
  updatePostComments,
} from "@/redux/slices/postModalSlice";

export default function PostComments() {
  const { user } = useSelector((store) => store.auth);
  const { post } = useSelector((store) => store.postModal);
  const dispatch = useDispatch();
  const [deleteComment] = useDeleteCommentMutation();
  const [likeComment] = useLikeCommentMutation();

  //yorumu sil
  async function handleDeleteComment(userCommentId, commentId) {
    await deleteComment({ postId: post._id, commentId, userId: userCommentId })
      .unwrap()
      .then((res) => {
        console.log(res);
        if (res.isSuccess) {
          toast.success(res.message);
          let newComments = post?.comments?.filter(
            (comment) => comment._id !== commentId
          );
          dispatch(updatePostComments(newComments));
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.data.message);
      });
  }

  return (
    <div className="">
      {post?.comments?.map((comment, i) => (
        <div key={comment._id} className="flex items-center justify-between">
          <div className="flex items-start p-3 ">
            <img
              src={comment.profilPhoto}
              alt="profil"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h5 className="text-xs font-bold mx-2">{comment.username}</h5>
              <h5 className="mx-2 font-normal text-[13px] leading-[16px]">
                {comment.text}
              </h5>
              <div className="flex mt-1 mx-2 items-center text-xs text-gray-400 md:space-x-3">
                <h5 className="w-[84px] hidden md:block">
                  {getTimeDifference(comment.createdAt)}
                </h5>
                <h5 className="w-[70px]">{comment.likes.length} beğenme</h5>
                {comment.userId === user._id ? (
                  <h5
                    onClick={() =>
                      handleDeleteComment(comment.userId, comment._id)
                    }
                    className="cursor-pointer hover:underline w-4"
                  >
                    Sil
                  </h5>
                ) : null}
              </div>
            </div>
          </div>
          {comment?.likes?.includes(user._id) ? (
            <FavoriteIcon
              className="cursor-pointer text-red-500 favorite-icon mr-2"
              onClick={() => {
                likeComment({
                  postId: post._id,
                  commentId: comment._id,
                  userId: user._id,
                })
                  .then(() => {
                    let newCommentLikes = comment.likes?.filter(
                      (like) => like !== user._id
                    );
                    dispatch(
                      updatePostCommentLikes({
                        data: newCommentLikes,
                        index: i,
                      })
                    );
                  })
                  .catch((error) => {
                    console.log(error);
                    toast.error(error.data.message);
                  });
              }}
            />
          ) : (
            <FavoriteBorderOutlinedIcon
              className="cursor-pointer favorite-icon mr-2"
              onClick={() => {
                likeComment({
                  postId: post._id,
                  commentId: comment._id,
                  userId: user._id,
                })
                  .then(() => {
                    let newCommentLikes = comment.likes?.concat(user._id);
                    dispatch(
                      updatePostCommentLikes({
                        data: newCommentLikes,
                        index: i,
                      })
                    );
                  })
                  .catch((error) => {
                    console.log(error);
                    toast.error(error.data.message);
                  });
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
