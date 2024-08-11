import React, { useState } from "react";
import { Bars4Icon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import SideMenu from "./SideMenu";

export default function HamburgerButtonMenu() {
  const [isSideMenuOpened, setIsSideMenuOpened] = useState(false);

  return (
    <div className="flex sm:hidden">
      <motion.div
        whileHover={{
          scale: 1.2,
        }}
        whileTap={{
          scale: 1,
        }}
        className="w-[30px] h-[30px] z-30"
        onClick={() => setIsSideMenuOpened((prev) => !prev)}
      >
        <Bars4Icon className="w-full h-full text-emerald-500 cursor-pointer" />
      </motion.div>
      {isSideMenuOpened && (
        <SideMenu setIsSideMenuOpened={setIsSideMenuOpened} />
      )}
    </div>
  );
}
