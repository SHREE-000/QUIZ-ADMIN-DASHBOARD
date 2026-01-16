// models/Subject.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import {Stream} from "./stream";

export interface ISubject extends Document {
  subject: string;
  stream: mongoose.Types.ObjectId;
  description?: string;
  videoContent?: string[];
  imageContent?: string[];
  pdfContent?: string[];
}

const SubjectSchema: Schema<ISubject> = new Schema<ISubject>(
  {
    subject: { type: String, required: true },
    stream: { type: Schema.Types.ObjectId, ref: Stream, required: true },
    description: { type: String, default: "" },
    videoContent: { type: [String], default: [] },
    imageContent: { type: [String], default: [] },
    pdfContent: { type: [String], default: [] },
  },
  { timestamps: true } // optional, adds createdAt & updatedAt
);

// Prevent recompilation in Next.js hot reload
export const Subject: Model<ISubject> =
  mongoose.models.Subject || mongoose.model<ISubject>("Subject", SubjectSchema);
