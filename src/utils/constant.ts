export const EMAIL_DUPLICATE =
  "Entered email is already present in the database";
export const JWT_SECRET_ERROR = "JWC SECRET KEY is missing";
export const NO_EMAIL = `Your Email isn't matching`;
export const PW_ERR = `Password isn't matching`;
export const NO_TOKEN = "No token present in the header";
export const TOKEN_DECODE_ERR = "Error in decoding the token";
export const ACCESS_TOKEN_GEN_ERR = "Failed to generate access token";
export const USER_NOT_FOUND =
  "User not found, either the user does not exist or inactive or the token is invalid";
export const FILE_UPLOAD_FIELDS = [
  { name: "img", maxCount: 100 },
  { name: "pdf", maxCount: 100 },
];
export const STREAM_ERR =
  "Stream creation failed. Either the stream already exists or there was an error during creation.";
export const NO_CONTENT_UPDATE =
  "No content update available. Please provide at least one field to update.";
export const INVALID_STREAM_ID = "Invalid stream ID";
export const INVALID_SUBJECT_ID = "Invalid subject ID";
export const INVALID_TOPIC_ID = "Invalid topic ID";
export const INVALID_QN_ID = "Invalid question ID";
export const STREAM_S3_PATH = "general-quiz/stream";
export const STREAM_CATEGORY = "stream";
export const SUBJECT_CATEGORY = "subject";
export const TOPIC_CATEGORY = "topic";
export const QN_CATEGORY = "question";
export const ALPH_OPTIONS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
export const ANS_LEN_ERR = "Answer exceeds options array length";
export const ANS_LOOKUP_ERR = `Answer couldn't findout from options`;
export const ANS_ALPH_ERR = "Answer should be one of the options from the";
export const NO_EXCEL_SHEET = "The Excel file has no sheets";
export const WRONG_EXCEL_OPTION_HEADER = "Wrong option header in excel sheet";
export const XLSX_ERROR = "Please upload a xlsx file";
export const IS_COMPLETE_ERR = "isComplete cannot send in body";
export const QN_MISSING = "Question is missing";
export const LANGUAGES = [
  "english",
  "hindi",
  "bengali",
  "marathi",
  "telugu",
  "tamil",
  "gujarati",
  "urdu",
  "kannada",
  "odia",
  "malayalam",
  "panjabi",
  "assamese",
  "maithili",
];
