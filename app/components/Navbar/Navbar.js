import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../api/context/authContext";
import Link from "next/link";
import axios from "axios";

import HamburgerButton from "./HamburgerButton";

function Navbar() {
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
    <header className="w-full h-[80px] bg-[#18181b] border-b-[1px] border-black">
      <div className="flex items-center justify-between h-full max-w-screen-2xl mx-auto px-[32px] ">
        <h1 className="text-[2rem] font-[700] text-zinc-300">Blog-Web</h1>
        <HamburgerButton />
        {user ? (
          <div className="hidden sm:flex items-center gap-[40px]">
            <div className="flex items-center gap-[5px]">
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
            <Link
              onClick={logout}
              href="/login"
              className="w-[120px] text-center bg-emerald-600 text-[1.4rem] text-zinc-300 font-[700] p-[8px] rounded-2xl "
            >
              Logout
            </Link>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-[30px]">
            <Link
              href="/login"
              className="text-[1.4rem] font-[700] text-zinc-300"
            >
              Login
            </Link>
            <Link
              href="/singup"
              className="w-[120px] text-center bg-emerald-600 text-[1.4rem] text-zinc-300 font-[700] p-[8px] rounded-2xl "
            >
              Sing in
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
