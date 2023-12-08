"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// to prevent ssr issues, intialize Reactquill using dynamic
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const AdminBlogCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // handle image upload to cloudinary
  const uploadImage = async (e) => {
    // get uploaded file from event handler
    const file = e.target.files[0];

    // check if file exists
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.CLOUNDINARY_UPLOAD_PRESET);

      // upload to cloudinary
      try {
        const response = await fetch(process.env.CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();

          toast.success("Image uploaded successfully");
          setImage(data.secure_url);
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred. Please try again");
      }
      setLoading(false);
    }
  };

  // handle blog creation
  const handleSubmit = async (e) => {
    try {
      const response = await fetch(`${process.env.API}/admin/blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          category,
          image,
        }),
      });

      if (response.ok) {
        router.push("/dashboard/admin");
        toast.success("Blog created successfully");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again");
    }
  };

  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <p className="lead text-center mt-5">Create a new blog post</p>

          <label className="text-secondary">Blog Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control p-2 my-2"
          />

          <label className="text-secondary">Blog Content</label>
          <ReactQuill
            className="border rounded my-2"
            value={content}
            onChange={(e) => setContent(e)}
          />

          <label className="text-secondary">Blog Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-control p-2 my-2"
          />

          {image && (
            <img
              src={image}
              alt="image preview"
              style={{
                width: "100px",
              }}
            />
          )}

          <div className="d-flex justify-content-between mt-2">
            <button className="btn btn-outline-secondary">
              <label className="mt-2 pointer" htmlFor="upload-button">
                {loading ? "Uploading" : "Upload image"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={uploadImage}
                hidden
                id="upload-button"
              />
            </button>

            <button
              className="btn bg-primary text-light"
              disabled={loading}
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogCreate;
