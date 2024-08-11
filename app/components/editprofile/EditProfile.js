"use client";

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ActionButton from "@/app/components/buttons/ActionButton";
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import AlertContext from "@/app/api/context/alertContext";
import AlertMessage from "@/app/components/alert/AlertMessage";
import supabase from "@/app/libs/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";

const validateName = (name) => {
  if (!name) {
    return "Name is required";
  } else if (name.length < 6 || name.length > 20) {
    return "Name must be between 6-20 characters";
  }
  return ""; // No error
};

export default function EditProfile() {
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [image, setImage] = useState(""); // Initial value set to an empty string
  const [preview, setPreview] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
  });

  const FILE_SIZE_LIMIT = 2 * 1024 * 1024; // 2 MB limit

  const { isAlertOpened, setIsAlertOpened } = useContext(AlertContext);

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
      setPreview("");
    }
  }

  function cancelImagePreview() {
    setPreview("");
    setImage(userData?.image_url || "");
  }

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      redirect("/");
    }

    async function fetchUserData() {
      try {
        const authToken = localStorage.getItem("token");
        const response = await axios.get("/api/users/query", {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        });

        const user = response.data.data[0];
        setUserData(user);
        setName(user?.name || "");
        setImage(user?.image_url || "");
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, []);

  function handleBlur(field) {
    setTouched((prevTouched) => ({
      ...prevTouched,
      [field]: true,
    }));

    if (field === "name") {
      setNameError(validateName(name));
    }
  }

  function handleNameChange(e) {
    const value = e.target.value;
    setName(value);
    if (touched.name) {
      setNameError(validateName(value));
    }
  }

  async function updateProfileHandle(e) {
    e.preventDefault();

    if (!name) {
      setNameError("Name is required.");
      return;
    }
    if (nameError) {
      return;
    }

    setIsSubmitted(true);

    let publicURL = image;

    if (image && typeof image !== "string") {
      const file_name = uuidv4();

      if (userData?.image_url) {
        const previousFileName = userData.image_url.split("/").pop();
        await supabase.storage
          .from("blogimage")
          .remove([`public/${previousFileName}`]);
      }

      const { data, error: uploadError } = await supabase.storage
        .from("blogimage")
        .upload(`public/${file_name}`, image);

      if (uploadError) {
        console.error("Error uploading new image:", uploadError.message);
        setAlertMessage("Failed to upload new image.");
        setAlertType("error");
        setIsAlertOpened(true);
        setIsSubmitted(false);
        return;
      }

      publicURL = supabase.storage
        .from("blogimage/public")
        .getPublicUrl(file_name).data.publicUrl;
    }

    try {
      const updateProfile = await axios.put("/api/users/query", {
        email: userData?.email,
        name: name,
        image_url: publicURL,
      });

      if (updateProfile) {
        setAlertMessage("Profile updated successfully");
        setAlertType("success");
        setIsAlertOpened(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
      setAlertMessage("Failed to update profile due to a database issue.");
      setAlertType("error");
      setIsAlertOpened(true);
    } finally {
      setIsSubmitted(false);
    }
  }

  return (
    <form
      onSubmit={updateProfileHandle}
      className="relative w-[450px] h-fit flex items-center flex-col gap-[20px] bg-[#18181b] rounded-md p-[32px] border-[1px] border-black shadow-md"
    >
      {isAlertOpened && (
        <AlertMessage message={alertMessage} type={alertType} />
      )}
      <div className="relative ">
        {preview ? (
          <img
            className="w-[200px] h-[200px] rounded-full object-cover "
            src={preview}
            alt="preview image"
          />
        ) : (
          <img
            className="w-[200px] h-[200px] rounded-full object-cover"
            src={
              userData?.image_url
                ? userData?.image_url
                : "https://cdn-icons-png.flaticon.com/512/9203/9203764.png"
            }
            alt="Profile"
          />
        )}

        {preview ? (
          <XCircleIcon
            onClick={cancelImagePreview}
            className="absolute right-0 bottom-0 w-[60px] h-[60px] text-rose-500 cursor-pointer"
          />
        ) : (
          <label htmlFor="file-upload">
            <PlusCircleIcon className="absolute right-0 bottom-0 w-[60px] h-[60px] text-emerald-500 cursor-pointer" />
          </label>
        )}

        <input
          className="w-full h-full"
          id="file-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      <div className="w-full">
        <div className="flex flex-col gap-[5px]">
          <label className="text-zinc-300 font-[700]">
            Name
            {touched.name && nameError && (
              <span className="text-red-500 ml-2">{nameError}</span>
            )}
          </label>
          <input
            onChange={handleNameChange}
            onBlur={() => handleBlur("name")}
            value={name}
            className="p-[10px] rounded-md  border-[2px] text-black border-zinc-500 outline-none"
            type="text"
            name="name"
          />
        </div>
      </div>
      <ActionButton type="submit" text="Update profile" disable={isSubmitted} />
      <div className="w-full text-left text-zinc-300 font-[700]">
        <Link href="/">Back to home</Link>
      </div>
    </form>
  );
}
