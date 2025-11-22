import { CorsOptions } from "cors";

const allowedOrigins: string[] = ["http://localhost:3000"];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl) or from allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Timestamp",
    "X-Signature",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
};
