import { setResponseHeader } from "@middleware/set-headers.js";
import { httpLogger } from "@utils/logger.js";
import cors, { CorsOptions } from "cors";
import express, { Application, Request, Response } from "express";

const app: Application = express();

const allowedOrigins: string[] = ["http://localhost:3000"];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
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

app.use(cors(corsOptions));
app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", setResponseHeader, (req: Request, res: Response) => {
  return res
    .status(200)
    .json(`Welcome to the server! ${new Date().toLocaleString()}`);
});

export default app;
