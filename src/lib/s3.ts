import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_BUCKET = process.env.AWS_BUCKET;

if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS credentials are not configured');
}

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

interface S3Params {
  Key: string;
  Body: Buffer | Uint8Array | Blob | string;
  ContentType: string;
}

interface DeleteS3Params {
  Key: string;
}

export const uploadFile = async (s3Params: S3Params) => {
  const data = await s3.send(new PutObjectCommand({ ...s3Params, Bucket: AWS_BUCKET }));
  return data;
};

export const deleteFile = async (s3Params: S3Params) => {
  const data = await s3.send(new DeleteObjectCommand({ ...s3Params, Bucket: AWS_BUCKET }));
  return data;
};

export const deleteFiles = async (urls: string[]) => {
  // Convert full URLs to S3 object keys
  const s3ParamKeys: DeleteS3Params[] = urls.map((url) => {
    const path = new URL(url).pathname; // e.g. /general-quiz/stream/xyz/img/file.jpg
    const key = path.startsWith("/") ? path.slice(1) : path; // remove leading "/"
    return { Key: key };
  });

  if (s3ParamKeys.length === 0) {
    console.log("No files to delete.");
    return;
  }

  const command = new DeleteObjectsCommand({
    Bucket: AWS_BUCKET,
    Delete: {
      Objects: s3ParamKeys.map(({ Key }) => ({ Key })),
    },
  });
  await s3.send(command);
};
