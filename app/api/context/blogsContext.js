"use client";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const BlogsContext = createContext();

export function BlogsContextProvider({ children }) {
  const [blogs, setBlogs] = useState([]);

  async function getBlogs() {
    try {
      const reponse = await axios.get("/api/blogs");
      setBlogs(reponse.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <BlogsContext.Provider value={{ blogs, getBlogs }}>
      {children}
    </BlogsContext.Provider>
  );
}

export default BlogsContext;
