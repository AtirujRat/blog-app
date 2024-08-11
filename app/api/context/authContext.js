"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});

  const jwt = require("jsonwebtoken");
  const secretKey = process.env.JWT_SECRET;
  const router = useRouter();

  function verifyToken(token) {
    try {
      const decoded = jwt.decode(token, secretKey);
      return decoded;
    } catch (err) {
      console.error("Token verification failed:", err);
      return null;
    }
  }

  async function getUserEmail() {
    try {
      const response = await axios.get("/api/users/getonlyemail");
      return response.data.data;
    } catch {
      alert("Error from supabase");
    }
  }

  const isTokenExpired = (token) => {
    if (!token) return true;

    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds

    return Date.now() > expiryTime;
  };

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    const data = verifyToken(authToken);
    if (isTokenExpired(authToken)) {
      localStorage.removeItem("token");
      setUser(null);
      setUserData({});
    } else if (authToken && data) {
      setUser(data);
    }
  }, []);

  function onFailure(res) {
    alert("something went wrong");
  }

  return (
    <AuthContext.Provider
      value={{ onFailure, user, userData, setUserData, getUserEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
