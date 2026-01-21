import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const file = searchParams.get("file") || "";
    if (!id?.trim() || !file?.trim()) {
      return NextResponse.json(
        { error: "Batch ID and File ID are required" },
        { status: 400 }
      );
    }
    if (file === "batchid") {
      const res = await openai.batches.retrieve(id);
      return NextResponse.json(res, { status: 200 });
    } else {
      const fileResponse = await openai.files.content(id);
      const fileContents = await fileResponse.text();
      return NextResponse.json(fileContents, { status: 200 });
    }
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
