import { attachAWSBasePath, uploadBatchToS3 } from "./general_fun";

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

interface File{
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
    stream?: string;
    subject?: string;
    topic?: string;
    description?: string;
    video?: string[];
    img?: File[];
    pdf?: File[];
  };
}) => {
  const { description, video = [], img = [], pdf = [] } = dto;
  interface Payload {
    [key: string]: string | string[] | undefined;
    stream?: string;
    description?: string;
    videoContent?: string[];
    imageContent: string[];
    pdfContent: string[];
  }
  const payload: Payload = {
      imageContent: [],
      pdfContent: []
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
  payload[category] = dto[category];
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

// export const payloadValidationForCategoryUpdation = async ({ category, url, dto }) => {
//   const { files, description, videoContent, imageContent, pdfContent } = dto;
//   const { img, pdf } = files;
//   const imgFromS3 = [];
//   const pdfFromS3 = [];
//   if (img?.length > 0) imgFromS3.push(...(await uploadBatchToS3(img, url)));
//   if (pdf?.length > 0) pdfFromS3.push(...(await uploadBatchToS3(pdf, url)));
//   const categoryId = dto[category];
//   const payload = { $addToSet: {} };
//   let search = {};
//   let categoryErrMsg = '';
//   if (category === 'stream') categoryErrMsg = INVALID_STREAM_ID;
//   if (category === 'subject') categoryErrMsg = INVALID_SUBJECT_ID;
//   if (category === 'topic') categoryErrMsg = INVALID_TOPIC_ID;
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
//       payload.$addToSet['videoContent'] = { $each: videoContent };
//       isUpdateContentAvailable = true;
//     }
//   }
//   if (imageContent?.length > 0) {
//     const isValid = validateS3URL(imageContent);
//     payload.$addToSet['imageContent'] = {};
//     if (isValid) {
//       payload.$addToSet['imageContent'] = { $each: imageContent };
//       isUpdateContentAvailable = true;
//     }
//   }
//   if (pdfContent?.length > 0) {
//     const isValid = validateS3URL(pdfContent);
//     payload.$addToSet['pdfContent'] = {};
//     if (isValid) {
//       payload.$addToSet['pdfContent'] = { $each: pdfContent };
//       isUpdateContentAvailable = true;
//     }
//   }
//   if (imgFromS3.length > 0) {
//     if (!payload.$addToSet['imageContent']) {
//       payload.$addToSet['imageContent'] = {};
//     }
//     const imgLinks = attachAWSBasePath(imgFromS3);
//     if (payload.$addToSet['imageContent']?.$each?.length > 0)
//       payload.$addToSet['imageContent'].$each.push(...imgLinks);
//     else payload.$addToSet['imageContent'].$each = imgLinks;
//     isUpdateContentAvailable = true;
//   }
//   if (pdfFromS3.length > 0) {
//     if (!payload.$addToSet['pdfContent']) {
//       payload.$addToSet['pdfContent'] = {};
//     }
//     const pdfLinks = attachAWSBasePath(pdfFromS3);
//     if (payload.$addToSet['pdfContent']?.$each?.length > 0)
//       payload.$addToSet['pdfContent'].$each.push(...pdfLinks);
//     else payload.$addToSet['pdfContent'].$each = pdfLinks;
//     isUpdateContentAvailable = true;
//   }
//   if (!isUpdateContentAvailable) {
//     throw new ConflictException(NO_CONTENT_UPDATE);
//   }
//   return { payload, search };
// };

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
