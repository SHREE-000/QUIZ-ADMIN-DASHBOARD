import { Types } from "mongoose";
import { deleteFiles } from "../lib/s3";
import {
  INVALID_STREAM_ID,
  INVALID_SUBJECT_ID,
  INVALID_TOPIC_ID,
  NO_CONTENT_UPDATE,
} from "./constant";
import {
  attachAWSBasePath,
  convertStringToOjbecId,
  uploadBatchToS3,
  validateObjectId,
  validateS3URL,
  validateYouTubeURL,
} from "./general_fun";

export const getAllCategoryQuery = (query: {
  category: string;
  search?: string;
  page: number;
  perPage: number;
}) => {
  const { category, search, page, perPage } = query;
  const filter: { [category]?: { $regex: string; $options: "i" } } = {};
  if (search?.trim()) {
    filter[category] = { $regex: search, $options: "i" };
  }
  const offset = (page - 1) * perPage;
  return {
    offset,
    limit: perPage,
    filter,
  };
};

interface File {
  size: number;
  type: string; // 'application/pdf' | 'image/jpeg' | 'image/png' | 'image/jpg'
  name: string;
  lastModified: number;
  arrayBuffer: () => Promise<ArrayBuffer>;
}

export const payloadValidationForCategoryCreation = async ({
  category,
  url,
  dto,
}: {
  category: "stream" | "subject" | "topic";
  url: string;
  dto: {
    stream?: string | Types.ObjectId;
    subject?: string | Types.ObjectId;
    topic?: string;
    description?: string;
    video?: string[];
    img?: File[];
    pdf?: File[];
  };
}) => {
  const { description, video = [], img = [], pdf = [], stream, subject } = dto;
  interface Payload {
    [key: string]: string | string[] | Types.ObjectId | undefined;
    stream?: Types.ObjectId | string;
    subject?: Types.ObjectId | string;
    topic?: string;
    description?: string;
    videoContent?: string[];
    imageContent: string[];
    pdfContent: string[];
  }
  const payload: Payload = {
    imageContent: [],
    pdfContent: [],
  };
  const imgFromS3: string[] = [];
  const pdfFromS3: string[] = [];

  if (img?.length > 0) {
    const uploaded = await uploadBatchToS3(img, url);
    imgFromS3.push(
      ...uploaded.filter((x): x is string => x !== null && x !== undefined)
    );
  }
  if (pdf?.length > 0) {
    const uploaded = await uploadBatchToS3(pdf, url);
    pdfFromS3.push(
      ...uploaded.filter((x): x is string => x !== null && x !== undefined)
    );
  }
  payload[category] =
    typeof dto[category] === "string"
      ? dto[category]
      : dto[category]?.toString();
  if (category === "subject" && typeof stream === "string" && stream?.trim())
    payload["stream"] = convertStringToOjbecId(stream);
  if (
    category === "topic" &&
    typeof stream === "string" &&
    stream?.trim() &&
    typeof subject === "string" &&
    subject?.trim()
  ) {
    payload["stream"] = convertStringToOjbecId(stream);
    payload["subject"] = convertStringToOjbecId(subject);
  }
  if (description) payload["description"] = description;
  if (video?.length > 0) payload["videoContent"] = video;
  if (imgFromS3.length > 0) {
    const imgLinks = attachAWSBasePath(imgFromS3);
    if (payload["imageContent"]?.length > 0)
      payload["imageContent"].push(...imgLinks);
    else payload["imageContent"] = imgLinks;
  }
  if (pdfFromS3.length > 0) {
    const pdfLinks = attachAWSBasePath(pdfFromS3);
    if (payload["pdfContent"]?.length > 0)
      payload["pdfContent"].push(...pdfLinks);
    else payload["pdfContent"] = pdfLinks;
  }
  return payload;
};

export const payloadValidationForCategoryUpdation = async ({
  category,
  url,
  dto,
}: {
  category: "stream" | "subject" | "topic";
  url: string;
  dto: {
    img: File[];
    pdf: File[];
    description?: string;
    videoContent?: string[];
    imageContent?: string[];
    pdfContent?: string[];
    category: string;
    categoryName?: string;
    removedImg?: string[];
    removedPdf?: string[];
    removedVideo?: string[];
    stream?: string;
    subject?: string;
  };
}) => {
  interface Dto {
    description?: string;
    category?: string;
    stream?: string | Types.ObjectId;
    subject?: string | Types.ObjectId;
    topic?: string;
    $addToSet: {
      videoContent?: { $each: string[] };
      imageContent?: { $each: string[] };
      pdfContent?: { $each: string[] };
    };
    $pull: {
      videoContent?: { $in: string[] };
      imageContent?: { $in: string[] };
      pdfContent?: { $in: string[] };
    };
  }
  const {
    img,
    pdf,
    description,
    videoContent = [],
    imageContent = [],
    pdfContent = [],
    removedImg = [],
    removedPdf = [],
    removedVideo = [],
    categoryName,
    stream = "",
    subject = ""
  } = dto;
  const imgFromS3: string[] = [];
  const pdfFromS3: string[] = [];
  let isUpdateContentAvailable = false;
  if (img?.length > 0) {
    const uploaded = await uploadBatchToS3(img, url);
    imgFromS3.push(...uploaded.filter((x): x is string => x !== null));
  }
  if (pdf?.length > 0) {
    const uploaded = await uploadBatchToS3(pdf, url);
    pdfFromS3.push(...uploaded.filter((x): x is string => x !== null));
  }
  const categoryId = dto.category;
  const payload: Dto = { $addToSet: {}, $pull: {} };
  if (categoryName) {
    payload[category] = categoryName;
    isUpdateContentAvailable = true;
  }
  if (category === 'subject' && stream) {
    payload["stream"] = convertStringToOjbecId(stream);
    isUpdateContentAvailable = true;
  }
    if (category === 'topic' && stream && subject) {
    payload["stream"] = convertStringToOjbecId(stream);
    payload["subject"] = convertStringToOjbecId(subject);
    isUpdateContentAvailable = true;
  }
  let search = {};
  let categoryErrMsg = "";
  if (category === "stream") categoryErrMsg = INVALID_STREAM_ID;
  if (category === "subject") categoryErrMsg = INVALID_SUBJECT_ID;
  if (category === "topic") categoryErrMsg = INVALID_TOPIC_ID;
  const isObjectId = validateObjectId(categoryId);
  if (isObjectId) search = { _id: convertStringToOjbecId(categoryId) };
  else throw new Error(categoryErrMsg);
  if (description) {
    payload["description"] = description;
    isUpdateContentAvailable = true;
  }
  if (videoContent?.length > 0) {
    const isValid = validateYouTubeURL(videoContent);
    console.log(isValid, "isValid");
    if (isValid) {
      payload.$addToSet["videoContent"] = { $each: videoContent };
      isUpdateContentAvailable = true;
    }
  }
  if (imageContent?.length > 0) {
    const isValid = validateS3URL(imageContent);
    if (isValid) {
      payload.$addToSet["imageContent"] = { $each: imageContent };
      isUpdateContentAvailable = true;
    }
  }
  if (pdfContent?.length > 0) {
    const isValid = validateS3URL(pdfContent);
    if (isValid) {
      payload.$addToSet["pdfContent"] = { $each: pdfContent };
      isUpdateContentAvailable = true;
    }
  }
  if (removedImg.length > 0) {
    payload.$pull["imageContent"] = { $in: removedImg };
    await deleteFiles(removedImg);
    isUpdateContentAvailable = true;
  }
  if (removedPdf.length > 0) {
    payload.$pull["pdfContent"] = { $in: removedPdf };
    await deleteFiles(removedPdf);
    isUpdateContentAvailable = true;
  }
  if (removedVideo.length > 0) {
    payload.$pull["videoContent"] = { $in: removedVideo };
    isUpdateContentAvailable = true;
  }
  if (imgFromS3.length > 0) {
    if (!payload.$addToSet["imageContent"]) {
      payload.$addToSet["imageContent"] = { $each: [] };
    }
    const imgLinks = attachAWSBasePath(imgFromS3);
    if (payload.$addToSet["imageContent"]?.$each?.length > 0)
      payload.$addToSet["imageContent"].$each.push(...imgLinks);
    else payload.$addToSet["imageContent"].$each = imgLinks;
    isUpdateContentAvailable = true;
  }
  if (pdfFromS3.length > 0) {
    if (!payload.$addToSet["pdfContent"]) {
      payload.$addToSet["pdfContent"] = { $each: [] };
    }
    const pdfLinks = attachAWSBasePath(pdfFromS3);
    if (payload.$addToSet["pdfContent"]?.$each?.length > 0)
      payload.$addToSet["pdfContent"].$each.push(...pdfLinks);
    else payload.$addToSet["pdfContent"].$each = pdfLinks;
    isUpdateContentAvailable = true;
  }
  if (!isUpdateContentAvailable) {
    throw new Error(NO_CONTENT_UPDATE);
  }
  return { payload, search };
};

export const validateAiQn = (qna: unknown) => {
  let qnCount = 0;
  let totalScore = 0;
  if (Array.isArray(qna)) {
    qnCount = qna.length;
  }
  if (Array.isArray(qna)) {
    for (let i = 0; i < qna.length; i++) {
      const { score } = qna[i];
      totalScore += score;
    }
  }
  return { qnCount, totalScore };
};

// export const payloadValidationForCategoryDeletion = async ({ category, dto }) => {
//   const { description, videoContent, imageContent, pdfContent } = dto;
//   let img = [];
//   let pdf = [];
//   const categoryId = dto[category];
//   const payload = { $pull: {} };
//   let search = {};
//   let categoryErrMsg = '';
//   if (category === 'stream') categoryErrMsg = INVALID_STREAM_ID;
//   if (category === 'subject') categoryErrMsg = INVALID_SUBJECT_ID;
//   if (category === 'topic') categoryErrMsg = INVALID_TOPIC_ID;
//   if (category === 'question') categoryErrMsg = INVALID_QN_ID;
//   const isObjectId = validateObjectId(categoryId);
//   if (isObjectId) search = { _id: convertStringToOjbecId(categoryId) };
//   else throw new ConflictException(categoryErrMsg);
//   let isUpdateContentAvailable = false;
//   if (description) {
//     payload['description'] = description;
//     isUpdateContentAvailable = true;
//   }
//   if (!isObjectId && categoryId) {
//     payload[category] = categoryId;
//     isUpdateContentAvailable = true;
//   }
//   if (videoContent?.length > 0) {
//     const isValid = validateS3URL(videoContent);
//     if (isValid) {
//       payload.$pull['videoContent'] = { $in: videoContent };
//       isUpdateContentAvailable = true;
//     }
//   }
//   if (imageContent?.length > 0) {
//     const isValid = validateS3URL(imageContent);
//     if (isValid) {
//       img = removeS3BasePath(imageContent);
//       payload.$pull['imageContent'] = { $in: imageContent };
//       isUpdateContentAvailable = true;
//     }
//   }
//   if (pdfContent?.length > 0) {
//     const isValid = validateS3URL(pdfContent);
//     if (isValid) {
//       pdf = removeS3BasePath(pdfContent);
//       payload.$pull['pdfContent'] = { $in: pdfContent };
//       isUpdateContentAvailable = true;
//     }
//   }
//   if (!isUpdateContentAvailable) {
//     throw new ConflictException(NO_CONTENT_UPDATE);
//   }
//   return { payload, search, img, pdf };
// };
