import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/database";
import { STREAM_S3_PATH, SUBJECT_CATEGORY } from "../../../utils/constant";
import {
  getAllCategoryQuery,
  payloadValidationForCategoryCreation,
} from "../../../utils/validation";
import mongoose from "mongoose";
import { deleteFiles } from "@/src/lib/s3";
import { Subject } from "@/src/models/subject";
import { validateObjectId } from "@/src/utils/general_fun";

export async function GET(request: Request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "30");
    const { filter, offset, limit } = getAllCategoryQuery({
      category: SUBJECT_CATEGORY,
      search,
      page,
      perPage,
    });
    const stream = await Subject.find(filter).limit(limit).skip(offset).exec();
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
    const stream = body.get("stream")?.toString()?.trim() ?? "";
    const subject = body.get("subject")?.toString()?.trim() ?? "";
    const isStream = validateObjectId(stream);
    if (!subject || stream || !isStream) {
      return NextResponse.json(
        { error: "Stream and Subject is required. Stream need to be valid object id" },
        { status: 400 }
      );
    }
    const subjectId = new mongoose.Types.ObjectId();
    const s3SubjectURL = `${STREAM_S3_PATH}/${stream}/subject/${subjectId}`;
    const payload = await payloadValidationForCategoryCreation({
      category: SUBJECT_CATEGORY,
      url: s3SubjectURL,
      dto: {
        pdf: pdfFiles,
        img: imgFiles,
        subject,
        stream,
        description: description?.toString().trim() || "",
        video: video?.toString()?.trim() ? video?.toString().split(",") : [],
      },
    });    
    imageContent = payload.imageContent;
    pdfContent = payload.pdfContent;
    const doc = new Subject({ ...payload, _id: subjectId });
    const streamDoc = await doc.save();
    return NextResponse.json(streamDoc, { status: 200 });
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
