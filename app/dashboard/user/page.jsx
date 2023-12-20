"use client";

import { useState, useEffect } from "react";
import BlogList from "@/components/blogs/BlogList";
import toast from "react-hot-toast";

const UserDashBoard = () => {
  const [likedBlogs, setlikedBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${process.env.API}/user/liked-blogs`, {});

      if (!response.ok) {
        toast.error("Failed to fetch blogs");
      } else {
        const data = await response.json();

        setlikedBlogs(data);
      }
    } catch (error) {
      toast.error("Something went wrong, try again");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <p className="lead text-center mt-5">Liked Blogs</p>
          <BlogList blogs={likedBlogs} />
        </div>
      </div>
    </div>
  );
};

export default UserDashBoard;
