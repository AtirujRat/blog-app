"use client";
import axios from "axios";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

import { AuthContextProvider } from "./api/context/authContext";
import Navbar from "./components/Navbar/Navbar";

export default function Home() {
  return (
    <AuthContextProvider>
      <Navbar />
    </AuthContextProvider>
  );
}
