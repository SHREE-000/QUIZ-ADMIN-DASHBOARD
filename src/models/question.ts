import mongoose, { Schema, Model } from "mongoose";
import { Topic } from "./topic";
import { Qn } from "../utils/interface";
// --------------------
// Question Schema
// --------------------

const QuestionSchema = new Schema<Qn>(
  {
    type: {
      type: String,
      enum: ["SINGLE", "PASSAGE"],
      default: "SINGLE",
    },
    topic: { type: Schema.Types.ObjectId, ref: Topic, required: true },
    subject: { type: Schema.Types.ObjectId, required: true },
    stream: { type: Schema.Types.ObjectId, required: true },
    qnCount: { type: Number, required: true },
    totalScore: { type: Number, required: true },
    qna: { type: Schema.Types.Mixed, required: true },
    passage: { type: Schema.Types.Mixed, required: true },
    exp: { type: Schema.Types.Mixed, required: true },
    imageContent: { type: [String], default: [] },
    videoContent: { type: [String], default: [] },
    pdfContent: { type: [String], default: [] },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    tags: { type: [String], default: [] },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: String, ref: "User", required: true },
  },
  { timestamps: true }
);

// Prevent model overwrite in Next.js hot reload
export const Question: Model<Qn> =
  mongoose.models.Question ||
  mongoose.model<Qn>("Question", QuestionSchema);
