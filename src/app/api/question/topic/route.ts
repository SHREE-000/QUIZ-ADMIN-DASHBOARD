import { connectDB } from "@/src/lib/database";
import { Question } from "@/src/models/question";
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
        { error: "Topic ID is required" },
        { status: 400 }
      );
    }    
    const questionData = await Question.find({topic: id});    
    if (!questionData) {
      return NextResponse.json({ error: "Question is not found" }, { status: 404 });
    }
    return NextResponse.json(questionData, { status: 200 });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
