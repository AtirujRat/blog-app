"use client";

import React, { useContext, useEffect, useState } from "react";
import Blog from "./Blog";
import BlogsContext from "@/app/api/context/blogsContext";

export default function BlogsList() {
  const { blogs } = useContext(BlogsContext);

  return (
    <div className="mx-auto mt-[100px]">
      {blogs.map((blog, index) => {
        return (
          <Blog
            key={index}
            blog_id={blog.id}
            name={blog.users.name}
            topic={blog.topic}
            description={blog.description}
            created_at={blog.created_at}
            profile_url={blog.users.image_url}
            image_url={blog.image_url}
          />
        );
      })}
    </div>
  );
}
