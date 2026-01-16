import {
  appendFile,
  writeFile,
  access,
  constants,
  truncate,
} from "fs/promises";
import { ResponseInput } from "openai/resources/responses/responses";
import { generateInputForQn } from "./ai";
import { GptInput } from "../utils/interface";
import { AI_TEXT_QN_FEED } from "../utils/constant";
import { uploadBatchToS3 } from "../utils/general_fun";

export const fileExists = async (path: string): Promise<boolean> => {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const generateGptInput = (content: ResponseInput, id: number) => {
  return {
    custom_id: `req-${id}`,
    method: "POST",
    url: "/v1/responses",
    body: {
      model: "gpt-5-mini",
      input: content,
    },
  };
};

// export const jsonlGeneratorFromPDF = async (file) => {
//   try {
//     await deleteJsonl('input.jsonl');
//     const data = await pdfParse(file.buffer);
//     const lines = data.text.replace(/\n|\|\Reprint 2025-26/g, '').trim();
//     const systemInput = `Task: Extract the MAXIMUM possible number of questions from the input text.\nOutput: A valid JSON array of strings, e.g., [\"Question 1\", \"Question 2\", ...] — no extra text.\nRules:\n- Treat any exercise statement, problem, instruction, or interrogative sentence as a question.\n- Count 'Prove that...', 'Find...', 'Check whether...', 'Explain why...', 'Show that...' as questions (even if they don’t end with a question mark).\n- Split numbered questions and sub-parts (i), (ii), (iii) into separate items.\n- Preserve the exact wording from the text for each extracted question.\n- Do NOT generate answers, explanations, or extra commentary.\n- Goal: maximize the number of distinct questions extracted from the input text.`;
//     const input = {
//       custom_id: 'req-1',
//       method: 'POST',
//       url: '/v1/responses',
//       body: {
//         model: 'gpt-5-mini',
//         input: [
//           { role: 'system', content: systemInput },
//           { role: 'user', content: JSON.stringify(lines) },
//         ],
//       },
//     };
//     addJsonl(input, 'input.jsonl');
//     return true;
//   } catch (error) {
//     console.error('Error generating JSON:', error);
//   }
// };

export const addJsonl = async (data: GptInput, path: string) => {
  try {
    if (await fileExists(path))
      await appendFile(path, `${JSON.stringify(data)}\n`);
    else await writeFile(path, `${JSON.stringify(data)}\n`);
  } catch (error) {
    console.error("Error adding to JSONL file:", error);
  }
};

export const deleteJsonl = async (path: string) => {
  try {
    if (await fileExists(path)) await truncate(path, 0);
  } catch (error) {
    console.error("Error deleting JSONL file:", error);
  }
};

export const qnBatching = async (data: string[]) => {
  await deleteJsonl(AI_TEXT_QN_FEED);
  for (let i = 0; i < data.length; i++) {
    const input = generateInputForQn(data[i]);
    const gptInput = generateGptInput(input, i);
    try {
      await addJsonl(gptInput, AI_TEXT_QN_FEED);
    } catch (error) {
      await deleteJsonl(AI_TEXT_QN_FEED);
      throw new Error(`Error adding to JSONL file: ${error}`);
    }
  }
};

export const uploadToS3 = async ({
  pdfFiles,
  imgFiles,
  url,
}: {
  imgFiles?: File[];
  pdfFiles?: File[];
  url: string;
}) => {
  const imgFromS3: string[] = [];
  const pdfFromS3: string[] = [];

  if (imgFiles && imgFiles?.length > 0) {
    const uploaded = await uploadBatchToS3(imgFiles, url);
    imgFromS3.push(
      ...uploaded.filter((x): x is string => x !== null && x !== undefined)
    );
  }
  if (pdfFiles && pdfFiles?.length > 0) {
    const uploaded = await uploadBatchToS3(pdfFiles, url);
    pdfFromS3.push(
      ...uploaded.filter((x): x is string => x !== null && x !== undefined)
    );
  }
};
