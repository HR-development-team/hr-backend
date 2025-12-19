import { Router } from "express";
import { getMetrics } from "./admin-dashboard.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/metrics", getMetrics);

export default router;
