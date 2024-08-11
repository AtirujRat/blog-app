import AuthContext from "@/app/api/context/authContext";
import React, { useContext, useState, useRef, useEffect } from "react";

import {
  PaperClipIcon,
  XCircleIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import AlertContext from "@/app/api/context/alertContext";
import AlertMessage from "@/app/components/alert/AlertMessage";
import { motion } from "framer-motion";
import axios from "axios";
import { TimeAgoHandle } from "@/app/hooks/useTimeAgo";
import { v4 as uuidv4 } from "uuid";
import supabase from "@/app/libs/supabaseClient";
import Modal from "@/app/components/modal/Modal";

function CommentList(props) {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [alertMessage, setAlertMessage] = useState(false);
  const [alertType, setAlertType] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isAlertOpened, setIsAlertOpened } = useContext(AlertContext);
  const [canSubmit, setCanSubmit] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [isImageOpened, setIsImageOpened] = useState(false);

  const textareaRef = useRef(null);
  const FILE_SIZE_LIMIT = 2 * 1024 * 1024; // 2 MB limit

  const { user, userData } = useContext(AuthContext);

  function toggleImage(img) {
    setCurrentImage(img);
    setIsImageOpened((prev) => !prev);
  }

  async function getComments() {
    try {
      const reponse = await axios.get(
        `/api/comments/?blogid=${props.currentComment}`
      );
      setComments(reponse.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getComments();
  }, []);

  function onChangeComment(e) {
    const value = e.target.value;
    setCommentInput(value);

    textareaRef.current.style.height = "auto"; //
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    if (value) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }

  function cancelImagePreview() {
    setPreview("");
    setImage(null);
    setCanSubmit(false);
  }

  function handleFileChange(event) {
    const file = event.target.files[0];

    if (file) {
      setCanSubmit(true);
      if (file.size > FILE_SIZE_LIMIT) {
        setAlertMessage("File size exceeds 2 MB limit.");
        setAlertType("error");
        setIsAlertOpened(true);
        setPreview("");
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(file);
        setPreview(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setPreview("");
    }
  }

  async function sendComment(e) {
    e.preventDefault();

    let publicURL;

    if (!image && !commentInput) {
      setCanSubmit(false);
      return;
    }
    const file_name = uuidv4();
    setIsSubmitted(true);

    if (image) {
      const { data, error } = await supabase.storage
        .from("blogimage")
        .upload(`public/${file_name}`, image);

      if (data) {
        publicURL = supabase.storage
          .from("blogimage/public")
          .getPublicUrl(file_name);
      }
    }
    try {
      const sendComment = await axios.post("/api/comments", {
        user_id: userData?.id,
        blog_id: props.currentComment,
        comment: commentInput,
        image_url_comment: publicURL ? publicURL.data.publicUrl : null,
      });
      if (sendComment) {
        setCanSubmit(false);
        setCommentInput("");
        setImage(false);
        setPreview(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitted(false);
      getComments();
    }
  }

  return (
    <motion.div
      initial={{
        left: 500,
        opacity: 0.5,
      }}
      animate={{
        left: 0,
        opacity: 1,
      }}
      className="absolute flex justify-end w-full h-full top-0 left-0"
    >
      {isAlertOpened && (
        <AlertMessage message={alertMessage} type={alertType} />
      )}
      {isImageOpened && (
        <Modal closeModal={() => toggleImage()}>
          <div className="flex items-center justify-center  max-w-4xl max-h-[700px] bg-black">
            <img className="object-cover" src={currentImage} alt="full image" />
          </div>
        </Modal>
      )}
      <div
        onClick={() => props.toggleCommentHandle()}
        className="bg-black absolute opacity-70 w-full h-full cursor-pointer"
      ></div>

      <div className="comment-sidebar w-[80%] md:w-[50%] h-full z-10 bg-[#18181b] p-[16px] overflow-y-auto ">
        {user ? (
          <div className="flex justify-between gap-[8px]">
            <img
              className="w-[45px] h-[45px] rounded-full object-cover "
              src={
                userData.image_url
                  ? userData.image_url
                  : "https://cdn-icons-png.flaticon.com/512/9203/9203764.png"
              }
              alt="image profile"
            />
            <form
              onSubmit={sendComment}
              className="relative h-fit w-full bg-[#3a3b3c] p-[14px] rounded-lg"
            >
              <textarea
                ref={textareaRef}
                value={commentInput}
                onChange={onChangeComment}
                rows={1} // Set the initial number of rows
                style={{ overflow: "hidden", resize: "none" }} // Hide the scrollbar and disable manual resize
                className=" text-[#afb1b3] bg-[#3a3b3c] w-[100%] rounded-lg pb-[10px] min-h-full outline-none" // Add Tailwind styling
                placeholder="Write an answer"
              />

              {preview ? (
                <div className="relative w-[100px] h-[100px]">
                  <img
                    className="w-full h-full object-cover rounded-lg"
                    src={preview}
                    alt="preview image"
                  />
                  <XCircleIcon
                    onClick={cancelImagePreview}
                    className="text-rose-500 absolute -top-[13px] -right-[13px] w-[30px] h-[30px] z-10 cursor-pointer"
                  />
                </div>
              ) : (
                <div>
                  <div>
                    <motion.label
                      whileHover={{
                        scale: 1.1,
                        color: "#059669",
                      }}
                      whileTap={{
                        scale: 1.0,
                        color: "#059669",
                      }}
                      htmlFor={`file-upload-${props.currentComment}`}
                      className="absolute text-[#afb1b3] bottom-1 w-[18px] h-[18px] cursor-pointer"
                    >
                      <PaperClipIcon />
                    </motion.label>
                    <input
                      className="w-full h-full"
                      id={`file-upload-${props.currentComment}`}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              )}

              <motion.button
                disabled={!canSubmit || isSubmitted}
                whileHover={{
                  scale: 1.1,
                  color: "#059669",
                }}
                whileTap={{
                  scale: 1.0,
                  color: "#059669",
                }}
                className={`absolute text-[#afb1b3] bottom-1 right-3 w-[18px] h-[18px] ${
                  canSubmit ? "cursor-auto" : "cursor-not-allowed"
                }`}
              >
                <PaperAirplaneIcon />
              </motion.button>
            </form>
          </div>
        ) : (
          <h1 className="text-center text-emerald-500 text-[1.3rem]">
            Login to comment.
          </h1>
        )}
        <div className="flex flex-col gap-[30px] mt-[30px]">
          {comments[0] ? (
            comments.map((item) => {
              return (
                <div className="flex gap-[9px] max-w-full">
                  <img
                    className="w-[30px] h-[30px] rounded-full object-cover "
                    src={
                      item.users.image_url
                        ? item.users.image_url
                        : "https://cdn-icons-png.flaticon.com/512/9203/9203764.png"
                    }
                    alt="image profile"
                  />
                  <div className="relative h-fit w-full max-w-72 bg-[#3a3b3c] py-[12px] px-[16px] rounded-lg">
                    <div className="flex flex-col">
                      <h1 className="text-[1rem] text-white">
                        {item.users.name}
                      </h1>
                      <p className="text-[#afb1b3] break-words ">
                        {item.comment}
                      </p>

                      {item.image_url_comment && (
                        <img
                          onClick={() => toggleImage(item.image_url_comment)}
                          className="w-full h-[150px] mt-[10px] rounded-lg object-cover cursor-pointer"
                          src={item.image_url_comment}
                          alt="comment_image"
                        />
                      )}
                      <span className="absolute text-[0.8rem] text-[#afb1b3] -bottom-[22px]">
                        <TimeAgoHandle date={item.created_at} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <h1 className="text-[#afb1b3] text-[1.1rem]">
              There is no comment.
            </h1>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default CommentList;
