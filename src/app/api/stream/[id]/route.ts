import { connectDB } from "@/src/lib/database";
import { Stream } from "@/src/models/stream";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = await context.params;    
    if (!id || !id.trim() || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Stream ID is required" }, { status: 400 });
    }
    const streamData = await Stream.findById(id);
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

export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = await context.params;  
    const body = await request.json();  
    console.log(body, 'body body');
    
    if (!id || !id.trim() || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Stream ID is required" }, { status: 400 });
    }
    const streamData = await Stream.findById(id);
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
