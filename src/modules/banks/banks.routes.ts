import { authMiddleware } from "@common/middleware/authMiddleware.js";
import { Router } from "express";
import { fetchBankOptions } from "./banks.controller.js";

const router = Router();
router.use(authMiddleware);

// get all bank options
router.get("/options", fetchBankOptions);

export default router;
