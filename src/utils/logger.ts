import morgan, { StreamOptions } from "morgan";

// --- Morgan stream setup ---
const stream: StreamOptions = {
  write: (message) => console.log(message.trim()),
};

const skip = () => process.env.NODE_ENV === "test";

const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";

// --- Morgan middleware for HTTP requests ---
const httpLogger = morgan(morganFormat, { stream, skip });

// --- Simple custom logger for manual logs ---
const appLogger = {
  info: (message: string) => console.log(`ℹ️  [INFO]: ${message}`),
  success: (message: string) => console.log(`✅ [SUCCESS]: ${message}`),
  warn: (message: string) => console.warn(`⚠️  [WARN]: ${message}`),
  error: (message: string) => console.error(`❌ [ERROR]: ${message}`),
};

export { httpLogger, appLogger };
