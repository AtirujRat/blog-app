import AlertContext from "@/app/api/context/alertContext";
import { motion } from "framer-motion";
import React, { useState, useEffect, useContext } from "react";

export default function AlertMessage({ message, type }) {
  const { isAlertOpened, setIsAlertOpened } = useContext(AlertContext);

  useEffect(() => {
    setTimeout(() => {
      setIsAlertOpened(false);
    }, 2000);
  });

  if (type === "success") {
    return (
      isAlertOpened && (
        <motion.div
          initial={{ top: 0, opacity: 0 }}
          animate={{ top: 100, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            duration: 0.3,
          }}
          className="fixed w-fit h-fit mx-auto inset-0 text-xl font-[700] text-black p-[16px] bg-emerald-500 flex items-center justify-center z-10 rounded-lg"
        >
          {message}
        </motion.div>
      )
    );
  }
  if (type === "error") {
    return (
      isAlertOpened && (
        <motion.div
          initial={{ top: 0 }}
          animate={{ top: 100 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            duration: 0.3,
          }}
          className="fixed top-[100px] text-xl font-[700] text-zinc-300 p-[16px] bg-rose-500 z-10 rounded-lg"
        >
          {message}
        </motion.div>
      )
    );
  }
}
