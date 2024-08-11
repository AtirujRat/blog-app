import React from "react";

export default function ActionButton({ text, type, disable }) {
  return (
    <button
      disabled={disable}
      type={type}
      className="w-full py-[10px] px-4 rounded-lg bg-slate-300 text-black font-semibold flex items-center justify-center hover:bg-slate-400 transition duration-200 ease-in-out"
    >
      {text}
    </button>
  );
}
