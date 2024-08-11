"use client";
import { TimeAgoHandle } from "@/app/hooks/useTimeAgo";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

import React, { useState } from "react";
import CommentList from "@/app/components/comments/CommentList";
import Modal from "../modal/Modal";

function Blog(props) {
  const [isCommentOpened, setIsCommentOpened] = useState(false);
  const [currentComment, setCurrentComment] = useState();
  const [currentImage, setCurrentImage] = useState("");
  const [isImageOpened, setIsImageOpened] = useState(false);

  function toggleCommentHandle(blog_id) {
    setIsCommentOpened((prev) => !prev);
    setCurrentComment(blog_id);
  }

  function toggleImage(img) {
    setCurrentImage(img);
    setIsImageOpened((prev) => !prev);
  }

  return (
    <div className="relative flex flex-col gap-[20px] bg-[#18181b] md:max-w-screen-md min-h-[400px] rounded-lg border border-zinc-800 p-4 overflow-hidden mx-auto mb-24">
      {isCommentOpened && (
        <CommentList
          isCommentOpened={isCommentOpened}
          currentComment={currentComment}
          toggleCommentHandle={toggleCommentHandle}
        />
      )}
      {!isCommentOpened && (
        <div
          onClick={() => toggleCommentHandle(props.blog_id)}
          className="absolute right-0 top-[100px] cursor-pointer bg-emerald-500 p-[8px] rounded-s-lg"
        >
          View comments
        </div>
      )}

      <div className="flex items-center">
        <img
          className="w-[50px] h-[50px] object-cover rounded-full"
          src={props.profile_url}
          alt="profile image"
        />
        <span className="text-[1.2rem] text-white ml-3 font-medium">
          {props.name}
        </span>
        <span className="flex items-center gap-[10px] text-sm text-zinc-400 ml-auto">
          <TimeAgoHandle date={props.created_at} />
          <div>
            <EllipsisHorizontalIcon className="w-[20px] h-[20px] cursor-pointer" />
          </div>
        </span>
      </div>

      <div className="text-[2rem] text-white font-semibold">{props.topic}</div>
      <div className="text-zinc-400">{props.description}</div>
      {props.image_url && (
        <img
          onClick={() => toggleImage(props.image_url)}
          className="mt-4 rounded-lg object-cover h-[400px] cursor-pointer"
          src={props.image_url}
          alt="blog_image"
        />
      )}

      {isImageOpened && (
        <Modal closeModal={() => toggleImage()}>
          <div className="flex items-center justify-center w-[900px] h-[700px]  max-w-4xl max-h-[700px] bg-black">
            <img className="object-cover" src={currentImage} alt="full image" />
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Blog;
