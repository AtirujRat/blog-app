"use client";

import React, { useContext, useEffect, useState } from "react";
import AuthContext from "@/app/api/context/authContext";
import Link from "next/link";
import axios from "axios";
import { PencilIcon } from "@heroicons/react/24/solid";

import HamburgerButton from "./HamburgerButtonMenu";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, userData, setUserData } = useContext(AuthContext);

  function logout() {
    localStorage.removeItem("token");
  }

  async function getUserData() {
    try {
      const authToken = localStorage.getItem("token");
      const response = await axios.get("/api/users/query", {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });
      setUserData(response.data.data[0]);
    } catch {
      console.log("error");
    }
  }

  useEffect(() => {
    if (user) {
      getUserData();
    }
  }, [user]);

  return (
    <header className="fixed top-0 w-full h-[80px] bg-[#18181b] border-b-[1px] border-black z-50 shadow-md">
      <div className="flex items-center justify-between h-full max-w-screen-xl mx-auto px-[32px] xl:p-0 ">
        <h1 className="text-[2rem] font-[700] text-zinc-300">Blog-Web</h1>
        <HamburgerButton />
        {user ? (
          <div className="hidden sm:flex items-center gap-[40px]">
            <div className="flex items-center gap-[15px]">
              <motion.div
                whileHover={{
                  scale: 1.1,
                }}
                whileTap={{
                  scale: 1,
                }}
                className="flex items-center border-[2px] border-emerald-500 rounded-md p-[5px]"
              >
                <Link href="editprofile">
                  <PencilIcon className="w-[12px] h-[12px] text-emerald-500 cursor-pointer" />
                </Link>
              </motion.div>
              <img
                className="w-[40px] h-[40px] rounded-full object-cover"
                src={
                  userData.image_url
                    ? userData?.image_url
                    : "https://cdn-icons-png.flaticon.com/512/9203/9203764.png"
                }
                alt="profile_image"
              />
              <h1 className="text-[1.1rem] text-zinc-300 font-[700]">
                {userData.name}
              </h1>
            </div>
            <motion.div
              whileHover={{
                scale: 1.1,
              }}
              whileTap={{
                scale: 1,
              }}
              className="w-[120px] text-center bg-emerald-600 text-[1.3rem] text-zinc-300 font-[700] p-[7px] rounded-xl cursor-pointer "
            >
              <Link onClick={logout} href="/login" className="">
                Logout
              </Link>
            </motion.div>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-[30px] cursor-pointer">
            <motion.div
              whileHover={{
                scale: 1.1,
              }}
              whileTap={{
                scale: 1,
              }}
            >
              <Link
                href="/login"
                className="text-[1.4rem] font-[700] text-zinc-300"
              >
                Login
              </Link>
            </motion.div>
            <motion.div
              whileHover={{
                scale: 1.1,
              }}
              whileTap={{
                scale: 1,
              }}
              className="w-[120px] text-center bg-emerald-600 text-[1.3rem] text-zinc-300 font-[700] p-[7px] rounded-xl cursor-pointer "
            >
              <Link href="/singup">Sing up</Link>
            </motion.div>
          </div>
        )}
      </div>
    </header>
  );
}
