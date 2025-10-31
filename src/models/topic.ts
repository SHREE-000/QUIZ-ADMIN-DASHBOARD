// models/Topic.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { Subject } from "./subject";
import { Stream } from "./stream";

export interface ITopic extends Document {
  topic: string;
  subject: mongoose.Types.ObjectId;
  stream: mongoose.Types.ObjectId;
  description?: string;
  videoContent?: string[];
  imageContent?: string[];
  pdfContent?: string[];
}

const TopicSchema: Schema<ITopic> = new Schema<ITopic>(
  {
    topic: { type: String, unique: true, required: true, index: true },
    subject: { type: Schema.Types.ObjectId, ref: Subject, required: true },
    stream: { type: Schema.Types.ObjectId, ref: Stream, required: true },
    description: { type: String, default: "" },
    videoContent: { type: [String], default: [] },
    imageContent: { type: [String], default: [] },
    pdfContent: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Prevent model overwrite in Next.js dev mode (Hot Reload)
export const Topic: Model<ITopic> =
  mongoose.models.Topic || mongoose.model<ITopic>("Topic", TopicSchema);
