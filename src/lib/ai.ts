import OpenAI from "openai";
import { ResponseInput } from "openai/resources/responses/responses";
const openai = new OpenAI();
import fs from "fs";
import { fileExists } from "./file";
import { AI_TEXT_QN_FEED } from "../utils/constant";
import { validateAiQn } from "../utils/validation";

const inputTranslate = (content: string): ResponseInput => {
  return [
    {
      role: "system",
      content: `JSON-only. Schema: 
      "translation": {
    "english": string,
    "hindi": string,
    "bengali": string,
    "marathi": string,
    "telugu": string,
    "tamil": string,
    "gujarati": string,
    "urdu": string,
    "kannada": string,
    "odia": string,
    "malayalam": string,
    "panjabi": string,
    "assamese": string,
    "maithili": string
  },
      Steps: 1.Translate → all languages. 
      2. Ensure correctness, coherence, and natural translations. 
      3. Validate that JSON is syntactically correct and logically consistent. 
      4. Output only JSON.
      `,
    },
    {
      role: "user",
      content: content,
    },
  ];
};
export const translate = async (content: string) => {
  const response = await openai.responses.create({
    model: "gpt-5-mini",
    input: inputTranslate(content),
    store: true,
  });
  return response.output_text;
};

export const generateInputForQn = (content: string): ResponseInput => {
  return [
    {
      role: "system",
      content: `JSON-only. Schema:{
  "difficulty": string, // "easy" | "medium" | "hard" — based on the provided input question
  "passage": {
    "english": string,
    "hindi": string,
    "bengali": string,
    "marathi": string,
    "telugu": string,
    "tamil": string,
    "gujarati": string,
    "urdu": string,
    "kannada": string,
    "odia": string,
    "malayalam": string,
    "panjabi": string,
    "assamese": string,
    "maithili": string
  },
  "exp": {
    (same languages as passage)
  },
  "qna": [
    {
      "translations": {
        "english": { "qn": string, "opt": [string, string, string, string] },
        "hindi":   { "qn": string, "opt": [string, string, string, string] },
        "...":     { ... }  // and so on for all listed languages
      },
      "difficulty": string,  // "easy", "medium", or "hard" - based on the question generated
      "ans": integer,        // index of correct option (0-based)
      "score": integer       // 1 for easy, 2 for medium, 3 for hard
    }
  ]
} Steps: 1.Translate → all languages. 2.Create maximum stepwise teaching MCQs from the problem. Split into sub-questions, randomize options, and vary the correct answer index each time. 
3. Set difficulty levels inside each QnA based on the generated question, and outside based on the input question from 10th standard NCERT. Assign score inside each question according to its difficulty: 1 for easy, 2 for medium, 3 for hard.
4. If question coming as input divide qn into multple qns. 
5. Ensure correctness, coherence, and natural translations. 
6. Validate that JSON is syntactically correct and logically consistent. 
7. Exclude image tags and non-text elements, but keep math symbols and equations intact for readability.
8. Output only JSON.
9. Create qns for class 5th standard level.`,
    },
    {
      role: "user",
      content: content,
    },
  ];
};

// export const getQnFromAI = async (content: string) => {
//   const response = await openai.responses.create({
//     model: 'gpt-5-mini',
//     input: generateInputForQn(content),
//     store: true,
//   });
//   return response.output_text;
// };

// export const pdfBatchFeeding = async () => {
//   const exists = await fileExists('input.jsonl');
//   if (!exists) {
//     throw new Error('Input file does not exist');
//   }
//   try {
//     const file = await openai.files.create({
//       file: fs.createReadStream('input.jsonl'),
//       purpose: 'batch',
//     });
//     const batch = await openai.batches.create({
//       input_file_id: file.id,
//       endpoint: '/v1/responses',
//       completion_window: '24h',
//     });
//     return batch.id;
//   } catch (error) {
//     console.error('Error creating batch:', error);
//     throw new Error('Batch creation failed');
//   }
// };

export const getAiBatchResult = async ({
  batch,
  metadata,
}: {
  batch: string;
  metadata: {
    subject: string;
    stream: string;
    updatedBy: string;
    topic: string;
  };
}) => {
  try {
    const payload = [];
    const result: { status: string; output_file_id?: string } =
      await openai.batches.retrieve(batch);

    if (result.status === "completed" && result.output_file_id) {
      const fileResponse = await openai.files.content(result.output_file_id);
      const extractedFileRes = await fileResponse.text();
      const lines = extractedFileRes.trim().split("\n");
      const parsedContent = lines.map((line) => JSON.parse(line));

      for (let i = 0; i < parsedContent.length; i++) {
        let type = "PASSAGE";
        try {
          const {
            response: {
              body: { output },
            },
          } = parsedContent[i];

          let content = [];
          if (output[1]?.type === "message") {
            content = output[1].content;
          } else if (output[0]?.type === "message") {
            content = output[0].content;
          }

          const contentData = content[0];
          if (contentData?.type === "output_text") {
            const sanitized = contentData.text.replace(/[\u0000-\u0019]+/g, "");

            // Try parsing, skip if invalid
            let parsedQn;
            try {
              parsedQn = JSON.parse(sanitized);
            } catch (error: unknown) {
              console.warn(
                `Skipping invalid JSON at index ${i}: ${
                  (error as Error).message
                }`
              );
              continue; // skip this iteration only
            }
            const { qnCount, totalScore } = validateAiQn(parsedQn.qna);
            if (qnCount > 1) type = "PASSAGE";
            else type = "SINGLE";
            payload.push({
              qnCount,
              totalScore,
              type,
              ...metadata,
              ...parsedQn,
            });
          } else {
            console.warn(`Skipping invalid output format at index ${i}`);
            continue;
          }
        } catch (innerError: unknown) {
          console.warn(
            `Error processing item ${i}:`,
            (innerError as Error).message
          );
          continue; // skip current iteration
        }
      }
    }
    return payload;
  } catch (error) {
    console.error("Error retrieving batch result:", error);
    throw new Error("Batch result retrieval failed");
  }
};

export const qnBatchFeeding = async () => {
  const exists = await fileExists(AI_TEXT_QN_FEED);
  if (!exists) {
    throw new Error("Input file does not exist");
  }
  try {
    const file = await openai.files.create({
      file: fs.createReadStream(AI_TEXT_QN_FEED),
      purpose: "batch",
    });
    const batch = await openai.batches.create({
      input_file_id: file.id,
      endpoint: "/v1/responses",
      completion_window: "24h",
    });
    return batch.id;
  } catch (error) {
    console.error("Error creating batch:", (error as Error).message);
    throw new Error("Batch creation failed");
  }
};
