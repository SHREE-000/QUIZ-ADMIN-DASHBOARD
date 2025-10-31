// models/Stream.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStream extends Document {
  stream: string;
  description?: string;
  videoContent?: string[];
  imageContent?: string[];
  pdfContent?: string[];
}

const StreamSchema: Schema<IStream> = new Schema<IStream>(
  {
    stream: { type: String, unique: true, required: true, index: true },
    description: { type: String, default: "" },
    videoContent: { type: [String], default: [] },
    imageContent: { type: [String], default: [] },
    pdfContent: { type: [String], default: [] },
  },
  { timestamps: true } // optional: adds createdAt & updatedAt
);

// Prevent model overwrite on hot reload in Next.js
export const Stream: Model<IStream> =
  mongoose.models.Stream || mongoose.model<IStream>("Stream", StreamSchema);
