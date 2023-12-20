import BlogCard from "./BlogCard";

const BlogList = ({ blogs }) => {
  return (
    <div className="container mb-5 mt-5">
      <div className="row">
        {blogs?.map((blog) => (
          <div key={blog._id} className="col-lg-4">
            <BlogCard blog={blog} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
