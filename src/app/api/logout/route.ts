import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({msg: "Logged out successfully"}, {
    status: 200,
  });
  response.cookies.set("token", "", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}