import { translate } from "@/src/lib/ai";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await axios.get(
      "https://api.openai.com/v1/batches",
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: unknown) {
    console.error("Open AI error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
     const body = await request.json();
    const res = await translate(body.content);
    return NextResponse.json(res, { status: 200 });
  } catch (error: unknown) {
    console.error("Open AI error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
