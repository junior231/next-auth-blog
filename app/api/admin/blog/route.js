import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Blog from "@/models/blog";
import slugify from "slugify";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  const _req = await req.json();
  await dbConnect();

  try {
    const { title, content, category, image } = _req;

    // validate form fields
    switch (true) {
      case !title:
        return NextResponse.json(
          { error: "Title is required" },
          { status: 400 }
        );
      case !content:
        return NextResponse.json(
          { error: "Content is required" },
          { status: 400 }
        );
      case !category:
        return NextResponse.json(
          { error: "Category is required" },
          { status: 400 }
        );
    }

    // check blog title uniqueness
    const existingBlog = await Blog.findOne({
      slug: slugify(title?.toLowerCase()),
    });

    if (existingBlog) {
      return NextResponse.json(
        { error: "Blog title already exists" },
        { status: 400 }
      );
    }

    // get current user id
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // create blog
    const blog = await Blog.create({
      title,
      content,
      category,
      image: image ? image : null,
      postedBy: token.user._id,
      slug: slugify(title),
    });

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
