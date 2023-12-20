"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaHeart } from "react-icons/fa";

const BlogLike = ({ blog }) => {
  const { data, status } = useSession();

  // initialize like state
  const [likes, setLikes] = useState(blog?.likes);

  const router = useRouter();
  const pathname = usePathname();

  // check if user already liked the blog
  const isAlreadyLiked = likes?.includes(data?.user?._id);

  const handleLike = async () => {
    // if user is not authenticated, re-route
    if (!status === "authenticated") {
      toast.error("Please login to like this blog");
      router.push(`/login?callback=${pathname}`);
      return;
    }

    try {
      // if user already liked the blog post, unlike
      if (isAlreadyLiked) {
        const answer = window.confirm("Are you sure you want to unlike?");

        if (answer) {
          handleUnlike();
        }
      } else {
        // implement like functionality
        const response = await fetch(`${process.env.API}/user/blog/like`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ blogId: blog?._id }),
        });

        if (!response.ok) {
          toast.error("Failed to like blog");
        } else {
          const data = await response.json();
          setLikes(data.likes);
          toast.success("Blog liked");
          router.refresh();
        }
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Error liking blog, try again");
    }
  };

  const handleUnlike = async () => {
    try {
      const response = await fetch(`${process.env.API}/user/blog/unlike`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blogId: blog?._id }),
      });

      if (!response.ok) {
        toast.error("Failed to unlikelike blog");
      } else {
        const data = await response.json();
        setLikes(data.likes);
        toast.success("Blog unliked");
        router.refresh();
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Error unliking blog, try again");
    }
  };

  return (
    <div>
      <small className="text-muted pointer">
        <FaHeart onClick={handleLike} color="red" /> {likes?.length} likes
      </small>
    </div>
  );
};

export default BlogLike;
