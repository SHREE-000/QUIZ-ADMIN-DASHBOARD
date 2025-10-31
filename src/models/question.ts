import mongoose, { Schema, Document, Model } from "mongoose";
import { Topic } from "./topic";

// --------------------
// Translation Schema
// --------------------
export interface ITranslation {
  qn: string;
  opt: (string | number)[];
}

// --------------------
// QnA Schema
// --------------------
export interface IQnA {
  translations: Map<string, ITranslation>;
  ans: number;
  score: number;
  _id: mongoose.Types.ObjectId;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

// --------------------
// Question Schema
// --------------------
export interface IQuestion extends Document {
  type: "SINGLE" | "PASSAGE";
  topic: mongoose.Types.ObjectId;
  subject: mongoose.Types.ObjectId;
  stream: mongoose.Types.ObjectId;
  qnCount: number;
  totalScore: number;
  qna: IQnA | IQnA[];
  passage: Map<string, string>;
  exp: Map<string, string>;
  imageContent?: string[];
  videoContent?: string[];
  pdfContent?: string[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags?: string[];
  updatedAt: Date;
  updatedBy: string;
}

const QuestionSchema = new Schema<IQuestion>(
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
      enum: ["EASY", "MEDIUM", "HARD"],
      default: "EASY",
    },
    tags: { type: [String], default: [] },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: String, ref: "User", required: true },
  },
  { timestamps: true }
);

// Prevent model overwrite in Next.js hot reload
export const Question: Model<IQuestion> =
  mongoose.models.Question ||
  mongoose.model<IQuestion>("Question", QuestionSchema);
