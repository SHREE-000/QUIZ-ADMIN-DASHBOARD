import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/database";
import User from "../../../models/user";
import { NO_EMAIL, PW_ERR } from "@/src/utils/constant";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const isUser = await User.findOne({ email });
    if (!isUser)
      return NextResponse.json({ error: NO_EMAIL }, { status: 400 });
    if (!(await isUser.comparePassword(password))) return NextResponse.json({ error: PW_ERR }, { status: 400 });
    const { _id, isAdmin, isActive } = isUser;
    const metaData = { _id, isAdmin, isActive, email };
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    const token = jwt.sign(metaData, process.env.JWT_SECRET as string);
    const payload = {
      access_token: token,
      ...metaData,
    };
    const response = NextResponse.json(payload, { status: 200 });
    response.cookies.set("token", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 10, // 10 day
  });
  return response;
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
