import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Blog from "@/models/blog";

export async function PUT(req, context) {
  await dbConnect();

  const _req = await req.json();

  const { id } = context.params;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { ..._req },
      { new: true }
    );

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error occured, Try again" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  await dbConnect();
  const { id } = context.params;
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);

    return NextResponse.json(deletedBlog, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error occured, Try again" },
      { status: 500 }
    );
  }
}
