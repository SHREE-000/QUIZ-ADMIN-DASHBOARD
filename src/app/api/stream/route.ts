import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/database";
import { STREAM_CATEGORY, STREAM_S3_PATH } from "../../../utils/constant";
import {
  getAllCategoryQuery,
  payloadValidationForCategoryCreation,
} from "../../../utils/validation";
import { Stream } from "../../../models/stream";
import mongoose from "mongoose";
import { deleteFiles } from "@/src/lib/s3";

export async function GET(request: Request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "100");
    const { filter, offset, limit } = getAllCategoryQuery({
      category: "stream",
      search,
      page,
      perPage,
    });
    const stream = await Stream.find(filter).limit(limit).skip(offset).exec();
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
    const stream = body.get("stream")?.toString() ?? "";
    if (!stream?.trim()) {
      return NextResponse.json(
        { error: "Stream name is required." },
        { status: 400 }
      );
    }
    const isStreamExists = await Stream.findOne({ stream: stream.trim() });
    if (isStreamExists) {
      return NextResponse.json(
        { error: "Stream name already exists." },
        { status: 400 }
      );
    }
    const streamId = new mongoose.Types.ObjectId();
    const s3StreamURL = `${STREAM_S3_PATH}/${streamId}`;
    const payload = await payloadValidationForCategoryCreation({
      category: STREAM_CATEGORY,
      url: s3StreamURL,
      dto: {
        pdf: pdfFiles,
        img: imgFiles,
        stream,
        description: description?.toString().trim() || "",
        video: video?.toString()?.trim() ? video?.toString().split(",") : [],
      },
    });    
    imageContent = payload.imageContent;
    pdfContent = payload.pdfContent;
    const doc = new Stream({ ...payload, _id: streamId });
    const streamDoc = await doc.save();
    return NextResponse.json(streamDoc, { status: 201  });
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
