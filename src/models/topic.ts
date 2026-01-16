// models/Topic.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { Subject } from "./subject";
import { Stream } from "./stream";

interface QnBatchData {
  batchId: string;
  qns: string[];
  tags?: string[];
  videoContent?: string[];
  imageContent?: string[];
  pdfContent?: string[];
  subject: string | mongoose.Types.ObjectId;
  stream: string | mongoose.Types.ObjectId;
}
export interface ITopic extends Document {
  topic: string;
  subject: mongoose.Types.ObjectId;
  stream: mongoose.Types.ObjectId;
  description?: string;
  videoContent?: string[];
  imageContent?: string[];
  pdfContent?: string[];
  qnBatchData?: QnBatchData[];
}

const TopicSchema: Schema<ITopic> = new Schema<ITopic>(
  {
    topic: { type: String, required: true, index: true },
    subject: { type: Schema.Types.ObjectId, ref: Subject, required: true },
    stream: { type: Schema.Types.ObjectId, ref: Stream, required: true },
    description: { type: String, default: "" },
    videoContent: { type: [String], default: [] },
    imageContent: { type: [String], default: [] },
    pdfContent: { type: [String], default: [] },
    qnBatchData: {type: [Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
);

// Prevent model overwrite in Next.js dev mode (Hot Reload)
export const Topic: Model<ITopic> =
  mongoose.models.Topic || mongoose.model<ITopic>("Topic", TopicSchema);
