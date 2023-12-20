import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Blog from "@/models/blog";
import { getToken } from "next-auth/jwt";

export async function PUT(req) {
  await dbConnect();

  // get request body
  const _req = await req.json();

  // destructure blogId from _req
  const { blogId } = _req;

  // get current user token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  try {
    // find blog and update likes array
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        // ensure user can not duplicate entry
        $pull: { likes: token.user._id },
      },
      // return updated object
      { new: true }
    );

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong. Try Again" },
      { status: 500 }
    );
  }
}
