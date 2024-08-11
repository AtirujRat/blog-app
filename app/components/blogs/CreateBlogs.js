import React, { useContext, useState, useEffect } from "react";
import ActionButton from "../buttons/ActionButton";
import { XCircleIcon, ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import AlertMessage from "../alert/AlertMessage";
import AlertContext from "@/app/api/context/alertContext";
import { v4 as uuidv4 } from "uuid";
import supabase from "@/app/libs/supabaseClient";
import { motion } from "framer-motion";
import AuthContext from "@/app/api/context/authContext";
import axios from "axios";
import BlogsContext from "@/app/api/context/blogsContext";

export default function CreateBlog() {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [alertMessage, setAlertMessage] = useState(false);
  const [alertType, setAlertType] = useState(false);
  const [topicError, setTopicError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isAlertOpened, setIsAlertOpened } = useContext(AlertContext);
  const { user, userData } = useContext(AuthContext);
  const { getBlogs } = useContext(BlogsContext);

  const FILE_SIZE_LIMIT = 2 * 1024 * 1024; // 2 MB limit

  function onChangeTopic(e) {
    const value = e.target.value;
    setTopic(value);
    if (value.length < 3) {
      setTopicError("At least 3 characters.");
    } else {
      setTopicError("");
    }
  }

  function onChangeDescription(e) {
    const value = e.target.value;
    setDescription(value);
    if (value.length < 10) {
      setDescriptionError("At least 10 characters.");
    } else {
      setDescriptionError("");
    }
  }

  function handleFileChange(event) {
    const file = event.target.files[0];

    if (file) {
      if (file.size > FILE_SIZE_LIMIT) {
        setAlertMessage("File size exceeds 2 MB limit.");
        setAlertType("error");
        setIsAlertOpened(true);
        setPreview("");
        return;
      }

      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setPreview("");
    }
  }

  function cancelImagePreview() {
    setPreview("");
    setImage(null);
  }

  async function createBlogHandle(e) {
    e.preventDefault();

    let publicURL;

    if (!topic) {
      setTopicError("Topic is required.");
    }
    if (!description) {
      setDescriptionError("Description is required.");
    }
    if (topic === "" || description === "") {
      return;
    }

    if (topicError || descriptionError) {
      return;
    } else {
      setIsSubmitted(true);

      const file_name = uuidv4();

      if (image) {
        const { data, error } = await supabase.storage
          .from("blogimage")
          .upload(`public/${file_name}`, image);

        if (data) {
          publicURL = supabase.storage
            .from("blogimage/public")
            .getPublicUrl(file_name);
        }

        if (error) {
          setAlertMessage("Failed to upload image.");
          setAlertType("error");
          setIsAlertOpened(true);
          return;
        }
      }

      try {
        const createBlog = await axios.post("/api/blogs", {
          user_id: userData?.id,
          topic: topic,
          description: description,
          image_url: publicURL ? publicURL.data.publicUrl : null,
        });
        if (createBlog) {
          setAlertMessage("Create blog successfully.");
          setAlertType("success");
          setIsAlertOpened(true);
          setTopic("");
          setDescription("");
          setImage("");
          setPreview("");
          getBlogs();
        }
      } catch {
        setAlertMessage("Failed create post because database issue.");
        setAlertType("error");
        setIsAlertOpened(true);
      } finally {
        setIsSubmitted(false);
      }
    }
  }

  return (
    <form
      onSubmit={createBlogHandle}
      className="relative flex flex-col gap-[40px] bg-[#18181b] md:max-w-screen-md p-[16px] md:rounded-md md:border-[1px] md:border-black text-white md:mx-auto"
    >
      {isAlertOpened && (
        <AlertMessage message={alertMessage} type={alertType} />
      )}
      {!user && (
        <div className="absolute text-2xl md:text-4xl text-emerald-500 font-[700] flex justify-center items-center w-full h-full bg-black opacity-70 top-0 left-0">
          Please login to create blog.
        </div>
      )}

      <h1 className="text-[2rem] font-[550] text-center">Create Blog</h1>

      <div className="flex flex-col md:justify-between md:flex-row gap-[20px]">
        <div className="flex flex-col gap-[30px] md:w-[50%]">
          <div className="flex flex-col gap-[10px]">
            <div className="flex items-center gap-[10px]">
              <label className="text-lg">Topic</label>
              {topicError && (
                <p className="text-rose-500 text-sm font-[500]">{topicError}</p>
              )}
            </div>
            <input
              onChange={onChangeTopic}
              value={topic}
              type="text"
              name="topic"
              placeholder="Topic"
              className="w-full text-black p-[7px] text-xl rounded-md outline-none"
            />
          </div>
          <div className="flex flex-col gap-[5px] outline-none">
            <div className="flex items-center gap-[10px]">
              <label className="text-lg">Description</label>
              {descriptionError && (
                <p className="text-rose-500 text-sm font-[500]">
                  {descriptionError}
                </p>
              )}
            </div>
            <textarea
              onChange={onChangeDescription}
              value={description}
              name="description"
              className="w-full h-[90px] text-black p-[5px] rounded-md outline-none"
              placeholder="Description"
            />
          </div>
        </div>
        <div className="md:w-[50%]">
          {preview ? (
            <div className="flex justify-center items-center w-full h-full">
              <div className="relative w-[200px] h-[200px]">
                <img
                  src={preview}
                  alt="Image Preview"
                  className=" w-full h-full object-cover rounded-lg"
                />
                <XCircleIcon
                  onClick={cancelImagePreview}
                  className="text-rose-500 absolute -top-[13px] -right-[13px] w-[30px] h-[30px] z-10 cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <motion.label
                whileHover={{
                  scale: 1.1,
                }}
                whileTap={{
                  scale: 1,
                }}
                htmlFor="file-upload"
                className="flex flex-col justify-center items-center gap-[15px] border-[3px] border-emerald-500 p-[12px] rounded-xl cursor-pointer"
              >
                <div className="flex flex-col justify-center items-center gap-[15px]">
                  <span>Upload image</span>
                  <ArrowUpTrayIcon className="w-[25px] h-[25px] text-emerald-500" />
                </div>
              </motion.label>
              <input
                className="w-full h-full"
                id="file-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
      </div>

      <ActionButton type="submit" text="Create" disable={isSubmitted} />
    </form>
  );
}
