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

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    const data = verifyToken(authToken);
    if (authToken) {
      setUser(data);
    } else {
      setUser(null);
    }
  }, []);

  function onFailure(res) {
    alert("something went wrong");
  }

  async function onSuccess(res) {
    const users = await axios.post("/api/users/loginwithgoogle", {
      email: res.profileObj.email,
      name: res.profileObj.name,
      image_url: res.profileObj.imageUrl,
    });

    localStorage.setItem("token", users.data.token);
    router.push("/");
  }

  return (
    <AuthContext.Provider
      value={{ onSuccess, onFailure, user, userData, setUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
