import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Blog from "@/models/blog";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
  await dbConnect();

  // get current logged in user
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  try {
    // find all liked blogs by user
    const blogs = await Blog.find({ likes: token.user._id });

    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Server error",
      },
      { status: 500 }
    );
  }
}
