"use client";

import Link from "next/link";

import toast from "react-hot-toast";

async function getBlogs(searchParams) {
  const urlParams = {
    page: searchParams.page || 1,
  };

  // get search query from url
  const searchQuery = new URLSearchParams(urlParams).toString();

  const response = await fetch(`${process.env.API}/blog?${searchQuery}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 1 },
  });

  if (!response.ok) {
    console.log("Failed to fetch blogs => ", response);
    throw new Error("Failed to fetch blogs");
  }

  const data = await response.json();

  return data;
}

export default async function AdminBlogsList({ searchParams }) {
  // get blogs when page renders
  const data = await getBlogs(searchParams);

  const { blogs, currentPage, totalPages } = data;

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/blog/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        window.location.reload();
        toast.success("Blog deleted successfully");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again");
    }
  };

  const handleClick = (id) => {
    const answer = window.confirm("Are you sure you want to delete this blog?");

    if (answer) {
      handleDelete(id);
    }
  };

  return (
    <div className="mt-5 container">
      <div className="lead text-primary mb-4 text-center">All Blogs</div>

      {blogs.map((blog) => (
        <div className="d-flex justify-content-between" key={blog._id}>
          <p className="lead">{blog.title}</p>
          <div className="d-flex justify-content-between align-items-center">
            <Link
              className="text-primary"
              href={`/dashboard/admin/blog/update/${blog.slug}`}
            >
              Update
            </Link>
            <button
              onClick={() => handleClick(blog._id)}
              className="btn btn-link text-danger"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-center">
        <nav aria-label="Page Navigation">
          <ul className="pagination">
            {hasPreviousPage && (
              <li className="page-item">
                <Link
                  href={`?page=${currentPage - 1}`}
                  className="page-link px-3"
                >
                  Prev
                </Link>
              </li>
            )}

            {/* create array from totalPages, map and return Links with page number */}
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <li
                  key={page}
                  className={`page-item ${
                    currentPage && currentPage === page ? "active" : ""
                  }`}
                >
                  <Link className="page-link" href={`?page=${page}`}>
                    {page}
                  </Link>
                </li>
              );
            })}

            {hasNextPage && (
              <li className="page-item">
                <Link
                  href={`?page=${currentPage + 1}`}
                  className="page-link px-3"
                >
                  Next
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
