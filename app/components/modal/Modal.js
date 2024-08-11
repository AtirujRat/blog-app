import React from "react";

export default function Modal({ children, closeModal }) {
  return (
    <div className="fixed flex justify-center items-center w-full h-full z-50 top-0 left-0">
      <div
        onClick={() => closeModal()}
        className="absolute bg-black opacity-30 max-lg:opacity-70 w-full h-full"
      ></div>
      <div className="max-lg:w-full z-10 max-lg:flex max-lg:justify-center">
        {children}
      </div>
    </div>
  );
}
