import React from "react";

import BlogsList from "./BlogsList";
import CreateBlog from "./CreateBlogs";

export default function Blogs() {
  return (
    <div className="w-full md:max-w-screen-xl md:mx-auto mt-[200px] xl:p-0 rounded-md">
      <CreateBlog />
      <BlogsList />
    </div>
  );
}
