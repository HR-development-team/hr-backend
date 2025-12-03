import cors from "cors";
import express, { Application, Request, Response } from "express";
import { httpLogger } from "@utils/logger.js";
import { setResponseHeader } from "@middleware/set-headers.js";
import { corsOptions } from "@config/cors.js";
import router from "./app.routes.js";
//import officeRoutes from "./modules/offices/office.routes.js"; // <--- Pastikan di-import

const app: Application = express();

app.use(cors(corsOptions));
app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health Check (Root)
app.get("/", setResponseHeader, (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Server is running",
    timestamp: new Date().toLocaleString(),
  });
});

// 3. Load Routes
// If you ever need v2, you just create app.routes.v2.ts and mount it line below.
app.use("/api/v1", router);
// app.use("/master-offices", officeRoutes);
export default app;
