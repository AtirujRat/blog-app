import AuthContext from "@/app/api/context/authContext";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useContext } from "react";

export default function SideMenu(props) {
  const { user, userData, setUserData } = useContext(AuthContext);

  function logout() {
    localStorage.removeItem("token");
  }

  return (
    <motion.div
      initial={{
        top: -100,
        opacity: 0,
      }}
      animate={{
        top: 0,
        opacity: 1,
      }}
      className="absolute flex justify-center  w-[100vw] h-[100vh] top-0 left-0"
    >
      <div className="bg-black absolute opacity-70 w-full h-full z-10"></div>
      <div className="flex flex-col pt-[100px] z-30">
        {user && (
          <div className="flex mx-[40px] items-center justify-center gap-[15px] p-[24px] border-b-[1px] border-zinc-400">
            <img
              className="w-[80px] h-[80px] rounded-full object-cover"
              src={
                userData.image_url
                  ? userData?.image_url
                  : "https://cdn-icons-png.flaticon.com/512/9203/9203764.png"
              }
              alt="profile_image"
            />
            <h1 className="text-[1.3rem] text-white font-[700]">
              {userData.name}
            </h1>
          </div>
        )}

        <div className="flex justify-around gap-[15px] p-[24px] text-white">
          {user ? (
            <>
              <motion.div
                whileHover={{
                  scale: 1.1,
                  color: "#10b981",
                }}
                whileTap={{ scale: 1 }}
                className="text-center"
              >
                <Link href="editprofile" className="text-[1.2rem] font-[700] ">
                  Edit Profile
                </Link>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.1,
                  color: "#10b981",
                }}
                whileTap={{ scale: 1 }}
                className="text-center text-white"
              >
                <Link
                  href="/login"
                  onClick={logout}
                  className="text-[1.2rem] font-[700] "
                >
                  Logout
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                whileHover={{
                  scale: 1.1,
                  color: "#10b981",
                }}
                whileTap={{ scale: 1 }}
                className="text-center"
              >
                <Link href="/singup" className="text-[1.2rem] font-[700] ">
                  Sing up
                </Link>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.1,
                  color: "#10b981",
                }}
                whileTap={{ scale: 1 }}
                className="text-center text-white"
              >
                <Link
                  href="/login"
                  onClick={logout}
                  className="text-[1.2rem] font-[700] "
                >
                  Login
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
