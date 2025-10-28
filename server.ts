import { config } from "dotenv";
import { appLogger } from "./src/utils/logger.js";
import app from "./src/app.js";

config();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  appLogger.success(`Server is running on port ${port}`);
});
