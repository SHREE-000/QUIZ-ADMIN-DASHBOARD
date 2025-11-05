import mongoose from "mongoose";
import { uploadFile } from "../lib/s3";
import pLimit from "p-limit";

export const validateS3URL = (url: string | string[]): boolean => {
  const { AWS_BUCKET, AWS_REGION } = process.env;
  const baseUrl = `https://${AWS_BUCKET}.${AWS_REGION}.amazonaws.com`;
  const validate = (url: string) => url.includes(baseUrl);
  return Array.isArray(url) ? url.every(validate) : validate(url);
};

export const validateObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

interface UploadFile {
  size: number;
  type: string; // 'application/pdf' | 'image/jpeg' | 'image/png' | 'image/jpg'
  name: string;
  lastModified: number;
  arrayBuffer: () => Promise<ArrayBuffer>; // Add this since it's a File
}

export const uploadBatchToS3 = async (files: UploadFile[], s3BaseURL: string) => {
  const limit = pLimit(25);
  const tasks = files.map((file) =>
    limit(async () => {
      const Body = Buffer.from(await file.arrayBuffer());
      const ContentType = file.type;
      const name = file.name;
      let subFolder = '';
      if (ContentType.includes('image')) subFolder = 'img';
      else if (ContentType.includes('pdf')) subFolder = 'pdf';
      const Key = `${s3BaseURL}/${subFolder}/${name}`;
      const params = {
        Key,
        ContentType,
        Body,
      };
      const result = await uploadFile(params);
      if (result.$metadata.httpStatusCode === 200) return Key;
      else return null;
    }),
  );
  return await Promise.all(tasks);
};

export const attachAWSBasePath = (urls: string[]) => {
  const { AWS_BUCKET, AWS_REGION } = process.env;
  return urls.map((url) => `https://${AWS_BUCKET}.${AWS_REGION}.amazonaws.com/${url}`);
};

export const removeS3BasePath = (urls: string[]) => {
  const { AWS_BUCKET, AWS_REGION } = process.env;
  const basePath = `https://${AWS_BUCKET}.${AWS_REGION}.amazonaws.com/`;
  return urls.map((url) => url.replace(basePath, ''));
};