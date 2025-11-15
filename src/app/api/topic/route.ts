import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/database";
import { STREAM_S3_PATH, TOPIC_CATEGORY } from "../../../utils/constant";
import {
  getAllCategoryQuery,
  payloadValidationForCategoryCreation,
} from "../../../utils/validation";
import mongoose from "mongoose";
import { deleteFiles } from "@/src/lib/s3";
import { Subject } from "@/src/models/subject";
import { validateObjectId } from "@/src/utils/general_fun";
import { Topic } from "@/src/models/topic";

export async function GET(request: Request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "100");
    const { filter, offset, limit } = getAllCategoryQuery({
      category: TOPIC_CATEGORY,
      search,
      page,
      perPage,
    });
    const stream = await Topic.find(filter).limit(limit).skip(offset).exec();
    return NextResponse.json(stream, { status: 200 });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let imageContent: string[] = [];
  let pdfContent: string[] = [];
  try {
    await connectDB();
    const body = await request.formData();
    const { pdf, img, description, video } = {
      pdf: body.getAll("pdf"),
      img: body.getAll("img"),
      description: body.get("description"),
      video: body.get("video"),
    };
    // convert FormDataEntryValue[] to File[] by filtering File instances
    const pdfFiles = (pdf as FormDataEntryValue[]).filter(
      (p): p is File => p instanceof File
    );
    const imgFiles = (img as FormDataEntryValue[]).filter(
      (p): p is File => p instanceof File
    );
    const topic = body.get("stream")?.toString()?.trim() ?? "";
    const stream = body.get("stream")?.toString()?.trim() ?? "";
    const subject = body.get("subject")?.toString()?.trim() ?? "";
    const isStream = validateObjectId(stream);
    const isSubject = validateObjectId(subject);
    if (!subject || !stream || !isStream || !isSubject) {
      return NextResponse.json(
        {
          error:
            "Topic, Stream and Subject is required. Stream and Subject need to be valid object id",
        },
        { status: 400 }
      );
    }
    const isSubjectExists = await Subject.findOne({ _id: subject, stream });
    if (!isSubjectExists) {
      return NextResponse.json(
        { error: "Stream is not exists." },
        { status: 400 }
      );
    }
    const isTopicExistsWithStreamAndSub = await Topic.findOne({
      topic: topic.trim(),
      stream: stream.trim(),
      subject: subject.trim(),
    });
    if (isTopicExistsWithStreamAndSub) {
      return NextResponse.json(
        {
          error: `Topic name is exists with same stream and subject - ${isTopicExistsWithStreamAndSub.stream} - ${isTopicExistsWithStreamAndSub.subject}.`,
        },
        { status: 400 }
      );
    }
    const topicId = new mongoose.Types.ObjectId();
    const s3TopicURL = `${STREAM_S3_PATH}/${stream}/subject/${subject}/topic/${topicId}`;
    const payload = await payloadValidationForCategoryCreation({
      category: TOPIC_CATEGORY,
      url: s3TopicURL,
      dto: {
        pdf: pdfFiles,
        img: imgFiles,
        topic,
        subject,
        stream,
        description: description?.toString().trim() || "",
        video: video?.toString()?.trim() ? video?.toString().split(",") : [],
      },
    });
    imageContent = payload.imageContent;
    pdfContent = payload.pdfContent;
    const doc = new Subject({ ...payload, _id: topicId });
    const streamDoc = await doc.save();
    return NextResponse.json(streamDoc, { status: 201 });
  } catch (error: unknown) {
    const urls = [...imageContent, ...pdfContent];
    await deleteFiles(urls);
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
