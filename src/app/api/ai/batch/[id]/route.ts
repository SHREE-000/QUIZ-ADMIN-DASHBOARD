import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    if (!id || !id.trim()) {
      return NextResponse.json(
        { error: "Batch ID is required" },
        { status: 400 }
      );
    }
    const res = await axios.get(
      `https://api.openai.com/v1/batches/${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return NextResponse.json(res.data, { status: 200 });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
