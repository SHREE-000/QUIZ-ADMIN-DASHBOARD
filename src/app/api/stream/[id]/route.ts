import { connectDB } from "@/src/lib/database";
import { deleteFiles } from "@/src/lib/s3";
import { Stream } from "@/src/models/stream";
import { STREAM_CATEGORY, STREAM_S3_PATH } from "@/src/utils/constant";
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
        { error: "Stream ID is required" },
        { status: 400 }
      );
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

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
    // interface Dto {
    // stream?: string;
    // description?: string;
    // video?: string[];
    // img?: File[];
    // pdf?: File[];
    // removedImg?: string[];
    // removedPdf?: string[];
    // removedVideo?: string[];   
    // updatedStream?: string;
    // updatedDescription?: string;
    // }
  try {
    await connectDB();
    const { id } = await context.params;
    if (!id || !id.trim() || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Stream ID is required" },
        { status: 400 }
      );
    }
    const streamData = await Stream.findById(id);
    if (!streamData) {
      return NextResponse.json({ error: "Stream not found" }, { status: 404 });
    }
    const body = await request.formData();
    const {
      pdf,
      img,
      updatedDescription,
      newVideo,
      updatedStream,
      removedImg,
      removedPdf,
      removedVideo,
    } = {
      pdf: body.getAll("pdf"),
      img: body.getAll("img"),
      newVideo: body.get("newVideo"),
      removedImg: body.get("removedImg"),
      removedPdf: body.get("removedPdf"),
      removedVideo: body.get("removedVideo"),
      updatedStream: body.get("updatedStream"),
      updatedDescription: body.get("updatedDescription"),
    };
    const trimmedUpdatedStream = updatedStream?.toString().trim() || "";
    if (trimmedUpdatedStream) {
        const isStreamExists = await Stream.findOne({ stream: trimmedUpdatedStream });
        if (isStreamExists) {
            return NextResponse.json(
                { error: "Stream name already exists." },
                { status: 400 }
            );
        }
    }
    const s3StreamURL = `${STREAM_S3_PATH}/${id}`;
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
    const finalRemovedImg = trimmedRemovedImg ? trimmedRemovedImg.split(",") : [];
    const trimmedRemovedPdf = removedPdf?.toString()?.trim();
    const finalRemovedPdf = trimmedRemovedPdf ? trimmedRemovedPdf.split(",") : [];
    const trimmedVideo = removedVideo?.toString()?.trim();
    const finalRemovedVideo = trimmedVideo ? trimmedVideo.split(",") : [],
        const payload = await payloadValidationForCategoryUpdation({
          category: STREAM_CATEGORY,
          url: s3StreamURL,
          dto: {
            category: id,
            categoryName: trimmedUpdatedStream,
            pdf: pdfFiles,
            img: imgFiles,
            description: updatedDescription?.toString().trim() || "",
            videoContent: finalNewVideo,
            removedImg: finalRemovedImg,
            removedPdf: finalRemovedPdf,
            removedVideo: finalRemovedVideo
          },
        }); 

        // placing s3 insertion after DB insertion because ensure transaction
          if (finalRemovedImg.length > 0) {
            await deleteFiles(finalRemovedImg);
          }
          if (finalRemovedPdf.length > 0) {
            await deleteFiles(finalRemovedPdf);
          }
    return NextResponse.json(payload, { status: 201 });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
