import { connectDB } from "@/src/lib/database";
import { Subject } from "@/src/models/subject";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const id = searchParams.get("id") || "";
    if (!id || !id.trim() || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }    
    const streamData = await Subject.find({stream: id});    
    if (!streamData) {
      return NextResponse.json({ error: "Stream not found" }, { status: 404 });
    }
    return NextResponse.json(streamData, { status: 200 });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
