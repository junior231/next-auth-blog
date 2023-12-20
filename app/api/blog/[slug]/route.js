import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Blog from "@/models/blog";

export async function GET(req, context) {
  await dbConnect();

  // get blog slug from context.params obj
  const { slug } = context.params;

  try {
    const blog = await Blog.findOne({ slug }).populate("postedBy", "name");

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
