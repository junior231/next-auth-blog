import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";
import bcrypt from "bcrypt";

export async function POST(req) {
  const _req = await req.json();
  console.log("logging req: ", _req);

  // wait for db to connect
  await dbConnect();

  try {
    const { name, email, password } = _req;

    // check if user with email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          err: "User with this email already exists",
        },
        { status: 409 }
      );
    } else {
      // hash password before saving to database
      const hashedPassword = await bcrypt.hash(password, 10);

      // save new user to database
      await new User({ name, email, password: hashedPassword }).save();

      return NextResponse.json({
        success: "Registration successful",
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        err: "Something went wrong in register api. Try again",
      },
      { status: 500 }
    );
  }
}
