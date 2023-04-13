import { Divider, IconButton, InputBase } from "@mui/material";
import DirectionsIcon from "@mui/icons-material/Directions";
import React from "react";
import { useState } from "react";
import { useAddCommentMutation } from "@/redux/services/commentService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updatePostComments } from "@/redux/slices/postModalSlice";

export default function InputComment() {
  const [message, setMessage] = useState("");
  const [addComment] = useAddCommentMutation();
  const { post } = useSelector((store) => store.postModal);
  const dispatch = useDispatch();

  async function makeComment() {
    if (message.trim() !== "") {
      await addComment({ message, postId: post._id })
        .unwrap()
        .then((res) => {
          if (res.isSuccess) {
            setMessage("");
            toast.success("Yorum Gönderildi");
            let newComments = post?.comments?.concat(res.comment);
            dispatch(updatePostComments(newComments));
          }
        })
        .catch((error) => toast.error(error.data.message));
    } else {
      toast.error("Birşeyler yazınız.");
    }
  }

  async function handleKeyDown() {
    if (event.key === "Enter") {
      makeComment();
    }
  }

  return (
    <div className="hidden text-white  w-full md:flex items-center justify-center">
      <InputBase
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{ ml: 1, flex: 1 }}
        placeholder="Yorum Ekle..."
        className="placeholder:text-white dark:text-white"
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton onClick={makeComment} color="primary" sx={{ p: "10px" }}>
        <DirectionsIcon />
      </IconButton>
    </div>
  );
}
