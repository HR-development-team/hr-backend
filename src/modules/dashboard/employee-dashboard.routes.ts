import { Router } from "express";
import { verifyToken } from "@middleware/jwt.js";
import { getMetrics } from "./employee-dashboard.controller.js";

const router = Router();
router.use(verifyToken);

router.get("/metrics", getMetrics);

export default router;
