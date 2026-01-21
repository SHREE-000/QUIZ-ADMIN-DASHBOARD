import mongoose, { Types } from "mongoose";
import { uploadFile } from "../lib/s3";
import pLimit from "p-limit";

interface UploadFile {
  size: number;
  type: string; // 'application/pdf' | 'image/jpeg' | 'image/png' | 'image/jpg'
  name: string;
  lastModified: number;
  arrayBuffer: () => Promise<ArrayBuffer>; // Add this since it's a File
}

export interface MONGO_UPDATEONE {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount: number;
  upsertedId: null | Types.ObjectId;
  upsertedCount: number;
}

export interface MONGO_DELETEONE {
  acknowledged: boolean;
  deletedCount: number;
}

export const validateS3URL = (url: string | string[]): boolean => {
  const { AWS_BUCKET, AWS_REGION } = process.env;
  const baseUrl = `https://${AWS_BUCKET}.s3.${AWS_REGION}.amazonaws.com`;
  const validate = (url: string) => url.includes(baseUrl);
  return Array.isArray(url) ? url.every(validate) : validate(url);
};

export const validateYouTubeURL = (url: string | string[]): boolean => {
  const pattern =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&].*)?$/;
  const validate = (url: string) => pattern.test(url.trim());
  return Array.isArray(url) ? url.every(validate) : validate(url);
};

export const validateObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const uploadBatchToS3 = async (
  files: UploadFile[],
  s3BaseURL: string
) => {
  const limit = pLimit(25);
  const tasks = files.map((file) =>
    limit(async () => {
      const Body = Buffer.from(await file.arrayBuffer());
      const ContentType = file.type;
      const name = file.name;
      let subFolder = "";
      if (ContentType.includes("image")) subFolder = "img";
      else if (ContentType.includes("pdf")) subFolder = "pdf";
      const Key = `${s3BaseURL}/${subFolder}/${name}`;
      const params = {
        Key,
        ContentType,
        Body,
      };
      const result = await uploadFile(params);
      if (result.$metadata.httpStatusCode === 200) return Key;
      else return null;
    })
  );
  return await Promise.all(tasks);
};

export const attachAWSBasePath = (urls: string[]) => {
  const { AWS_BUCKET, AWS_REGION } = process.env;
  return urls.map(
    (url) => `https://${AWS_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${url}`
  );
};

export const removeS3BasePath = (urls: string[]) => {
  const { AWS_BUCKET, AWS_REGION } = process.env;
  const basePath = `https://${AWS_BUCKET}.s3.${AWS_REGION}.amazonaws.com/`;
  return urls.map((url) => url.replace(basePath, ""));
};

export const removeSpecialChar = (str: string): string =>
  str
    .replace(
      /(?:\(\d+\))|(?:\d\))|(?:[a-zA-Z]\.)|(?:[a-zA-Z]\))|(?:\([a-zA-Z]\))|(?:^\d+\.\s*)/g,
      ""
    )
    .trim();

export const getExtention = (filename: string): string => {
  const extensionArr = filename.split(".");
  return extensionArr[extensionArr.length - 1].trim();
};

export const generateOTP = (): number => Math.ceil(Math.random() * 10000);

export const generateUniqueCode = (): string =>
  `${generateOTP()}-${Date.now()}`;

export const convertStringToOjbecId = (str: string): mongoose.Types.ObjectId =>
  mongoose.Types.ObjectId.createFromHexString(str);

export const validateEmail = (email: string) => {
  const emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  if (!email) return false;

  if (email.length > 254) return false;

  const valid = emailRegex.test(email);
  if (!valid) return false;

  // Further checking of some things regex can't handle
  const parts = email.split("@");
  if (parts[0].length > 64) return false;

  const domainParts = parts[1].split(".");
  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  )
    return false;

  return true;
};

export const mongoUpdateErrorValidation = (result: MONGO_UPDATEONE) => {
  if (result.modifiedCount === 0) {
    if (result.matchedCount === 1)
      throw new Error("There is no change in the content to edit");
    else throw new Error("Error occured while updating");
  }
  return true;
};

export const mongoDeleteErrorValidation = async (result: MONGO_DELETEONE) => {
  if (result.deletedCount >= 1) return true;
  else {
    throw new Error(
      "Couldn't delete the document. Either doucument is already deleted or document is not matched with passed id"
    );
  }
};

export const isAuth = (userId: string | Types.ObjectId, author: string) => {
  if (author.toString() !== userId.toString())
    throw new Error(
      "There is no permission to update document for current user"
    );
};
