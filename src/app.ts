import { setResponseHeader } from "@middleware/set-headers.js";
import { httpLogger } from "@utils/logger.js";
import cors, { CorsOptions } from "cors";
import express, { Application, Request, Response } from "express";

const app: Application = express();

// ====================================================================
// ||                 CORS CONFIGURATION SECTION                     ||
// ====================================================================
const allowedOrigins: string[] = ["http://localhost:3000"];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) or from allowed origins
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

// ====================================================================
// ||                     GLOBAL MIDDLEWARE                          ||
// ====================================================================
app.use(cors(corsOptions));
app.use(httpLogger); // HTTP Request Logger
app.use(express.json()); // Body Parser for JSON payloads
app.use(express.urlencoded({ extended: false })); // Body Parser for URL-encoded payloads

// ====================================================================
// ||                        ROOT ROUTE                              ||
// ====================================================================
app.get("/", setResponseHeader, (req: Request, res: Response) => {
  return res
    .status(200)
    .json(`Welcome to the server! ${new Date().toLocaleString()}`);
});

// ====================================================================
// ||                    ROUTE REGISTERING GOES HERE                 ||
// ====================================================================
// Example:
// import authRoutes from '@routes/auth.js';
// app.use('/api/v1/auth', authRoutes);

export default app;
