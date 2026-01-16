import { qnBatchFeeding } from "@/src/lib/ai";
import { connectDB } from "@/src/lib/database";
import { qnBatching } from "@/src/lib/file";
import { Stream } from "@/src/models/stream";
import { Subject } from "@/src/models/subject";
import { Topic } from "@/src/models/topic";
import { mongoUpdateErrorValidation } from "@/src/utils/general_fun";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.formData();
    const { tags, topic, subject, stream, qns } = {
      tags: body.get("tags"),
      topic: body.get("topic")?.toString() || "",
      subject: body.get("subject")?.toString() || "",
      stream: body.get("stream")?.toString() || "",
      qns: JSON.parse(body.get("qns")?.toString() || "[]"),
    };
    if (!topic || !subject || !stream || !qns) {
      return NextResponse.json(
        {
          error:
            "Missing required fields. Must be included: topic, subject, stream, qns",
        },
        { status: 400 }
      );
    }
    const streamData = await Stream.find({ stream });
    if (!streamData) {
      return NextResponse.json(
        { error: "Stream is not found" },
        { status: 404 }
      );
    }
    const subjectData = await Subject.find({ subject });
    if (!subjectData) {
      return NextResponse.json(
        { error: "Subject is not found" },
        { status: 404 }
      );
    }
    const topicData = await Topic.find({ topic });
    if (!topicData) {
      return NextResponse.json(
        { error: "Topic is not found" },
        { status: 404 }
      );
    }
    if (!qns || qns.length <= 0) throw new Error("no qns");
    await qnBatching(qns);
    const batchId = await qnBatchFeeding();
    const payload = {
      batchId,
      qns,
      tags,
      subject,
      stream,
    };
    const updateRes = await Topic.updateOne(
      { topic },
      { $push: { qnBatchData: payload } }
    );
    const isUpdate = mongoUpdateErrorValidation(updateRes);
    if (!isUpdate) {
      return NextResponse.json(
        { error: "Failed to update topic with question batch data" },
        { status: 500 }
      );
    }
    return NextResponse.json(payload, { status: 200 });
  } catch (error: unknown) {
    console.error("Service connection error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
