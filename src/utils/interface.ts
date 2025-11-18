import mongoose, { Types } from "mongoose";

export interface QnOpt {
  qn: string;
  opt: (string | number)[];
}

export interface QnA {
  translations: Map<string, QnOpt>;
  ans: number;
  score: number;
  _id: mongoose.Types.ObjectId;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface Qn extends Document {
  type: "SINGLE" | "PASSAGE";
  topic: mongoose.Types.ObjectId;
  subject: mongoose.Types.ObjectId;
  stream: mongoose.Types.ObjectId;
  qnCount: number;
  totalScore: number;
  qna: QnA | QnA[];
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
export interface StreamDto {
  _id: string | Types.ObjectId;
  stream: string;
}
export interface SubDto {
  _id: string | Types.ObjectId;
  subject: string;
}
export interface CategoryDto {
  _id: string | Types.ObjectId;
  data: string;
}
export interface Subject {
    _id: string;
    stream: string;
    subject: string;
    description: string;
    videoContent: string[];
    imageContent: string[];
    pdfContent: string[];
  };

export interface Topic {
    _id: string;
    topic: string;
    subject: string;
    stream: string;
    description: string;
    videoContent: string[];
    imageContent: string[];
    pdfContent: string[];
  };