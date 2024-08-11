"use client";

import { AuthContextProvider } from "./api/context/authContext";
import Navbar from "./components/Navbar/Navbar";
import Blogs from "./components/blogs/Blogs";
import { AlertContextProvider } from "./api/context/alertContext";
import { BlogsContextProvider } from "./api/context/blogsContext";

export default function Home() {
  return (
    <AuthContextProvider>
      <AlertContextProvider>
        <BlogsContextProvider>
          <Navbar />
          <Blogs />
        </BlogsContextProvider>
      </AlertContextProvider>
    </AuthContextProvider>
  );
}
