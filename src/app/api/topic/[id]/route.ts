import { connectDB } from "@/src/lib/database";
import { deleteFiles } from "@/src/lib/s3";
import { Stream } from "@/src/models/stream";
import { Subject } from "@/src/models/subject";
import { Topic } from "@/src/models/topic";
import { STREAM_S3_PATH, TOPIC_CATEGORY } from "@/src/utils/constant";
import {
  mongoUpdateErrorValidation,
  validateObjectId,
} from "@/src/utils/general_fun";
import { payloadValidationForCategoryUpdation } from "@/src/utils/validation";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    if (!id || !id.trim() || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Subject ID is required" },
        { status: 400 }
      );
    }
    const subjectData = await Topic.findById(id);
    if (!subjectData) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }
    return NextResponse.json(subjectData, { status: 200 });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    if (!id || !id.trim() || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Topic ID is required" },
        { status: 400 }
      );
    }
    const topicData = await Topic.findById(id);
    if (!topicData) {
      return NextResponse.json(
        { error: "Topic is not found" },
        { status: 404 }
      );
    }
    const body = await request.formData();
    const {
      pdf,
      img,
      updatedDescription,
      updatedTopic,
      existingSubject,
      newVideo,
      updatedSubject,
      updatedStream,
      removedImg,
      removedPdf,
      removedVideo,
      existingStream,
    } = {
      pdf: body.getAll("pdf"),
      img: body.getAll("img"),
      newVideo: body.get("newVideo"),
      removedPdf: body.get("removedPdf"),
      removedImg: body.get("removedImg"),
      removedVideo: body.get("removedVideo"),
      updatedStream: body.get("updatedStream"),
      existingStream: body.get("existingStream"),
      updatedSubject: body.get("updatedSubject"),
      existingSubject: body.get("existingSubject"),
      updatedTopic: body.get("updatedTopic"),
      updatedDescription: body.get("updatedDescription"),
    };
    const trimmedUpdatedTopic = updatedTopic?.toString()?.trim() || "";
    const trimmedUpdatedSubject = updatedSubject?.toString()?.trim() || "";
    const trimmedUpdatedStream = updatedStream?.toString()?.trim() || "";
    const trimmedExistingStream = existingStream?.toString()?.trim() || "";
    const trimmedExistingSubject = existingSubject?.toString()?.trim() || "";
    const finalStream = trimmedUpdatedStream
      ? trimmedUpdatedStream
      : trimmedExistingStream;
    const finalSubject = trimmedUpdatedSubject
      ? trimmedUpdatedSubject
      : trimmedExistingSubject;
    if (!validateObjectId(finalStream))
      return NextResponse.json(
        { error: "Stream is not object Id" },
        { status: 400 }
      );
    const isStream = Stream.findById(finalStream);
    if (!isStream)
      return NextResponse.json(
        { error: "No Stream is found" },
        { status: 400 }
      );
    if (!validateObjectId(finalSubject))
      return NextResponse.json(
        { error: "Subject is not object Id" },
        { status: 400 }
      );
    const isSubject = Subject.findById(finalSubject);
    if (!isSubject)
      return NextResponse.json(
        { error: "No Subject is found" },
        { status: 400 }
      );
    const s3SubjectURL = `${STREAM_S3_PATH}/${finalStream}/subject/${finalSubject}/topic/${id}`;
    // convert FormDataEntryValue[] to File[] by filtering File instances
    const pdfFiles = (pdf as FormDataEntryValue[]).filter(
      (p): p is File => p instanceof File
    );
    const imgFiles = (img as FormDataEntryValue[]).filter(
      (p): p is File => p instanceof File
    );
    const trimmedNewVideo = newVideo?.toString()?.trim();
    const finalNewVideo = trimmedNewVideo ? trimmedNewVideo.split(",") : [];
    const trimmedRemovedImg = removedImg?.toString()?.trim();
    const finalRemovedImg = trimmedRemovedImg
      ? trimmedRemovedImg.split(",")
      : [];
    const trimmedRemovedPdf = removedPdf?.toString()?.trim();
    const finalRemovedPdf = trimmedRemovedPdf
      ? trimmedRemovedPdf.split(",")
      : [];
    const trimmedVideo = removedVideo?.toString()?.trim();
    const finalRemovedVideo = trimmedVideo ? trimmedVideo.split(",") : [];
    const payload = await payloadValidationForCategoryUpdation({
      category: TOPIC_CATEGORY,
      url: s3SubjectURL,
      dto: {
        stream: trimmedUpdatedStream,
        subject: trimmedUpdatedSubject,
        category: id,
        categoryName: trimmedUpdatedTopic,
        pdf: pdfFiles,
        img: imgFiles,
        description: updatedDescription?.toString().trim() || "",
        videoContent: finalNewVideo,
        removedImg: finalRemovedImg,
        removedPdf: finalRemovedPdf,
        removedVideo: finalRemovedVideo,
      },
    });
    const { search, payload: input } = payload;
    const response = await Topic.updateOne(search, input);
    mongoUpdateErrorValidation(response);

    // placing s3 insertion after DB insertion because ensure transaction
    if (finalRemovedImg.length > 0) {
      await deleteFiles(finalRemovedImg);
    }
    if (finalRemovedPdf.length > 0) {
      await deleteFiles(finalRemovedPdf);
    }
    return NextResponse.json(payload, { status: 200 });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
