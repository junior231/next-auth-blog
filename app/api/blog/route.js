import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Blog from "@/models/blog";
import queryString from "query-string";

export async function GET(req) {
  await dbConnect();

  // get search params from request url
  const searchParams = queryString.parseUrl(req.url).query;

  // destructure page from search params
  const { page } = searchParams || {};

  // page size per GET request
  const pageSize = 6;

  try {
    // get current page number
    const currentPage = Number(page) || 1;

    // number of pages to skip
    const pagesToSkip = (currentPage - 1) * pageSize;

    // get total amount blogs available
    const totalBlogs = await Blog.countDocuments({});

    // return blogs
    const blogs = await Blog.find({})
      .populate("postedBy", "name")
      .skip(pagesToSkip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        blogs,
        currentPage,
        totalPages: Math.ceil(totalBlogs / pageSize),
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
