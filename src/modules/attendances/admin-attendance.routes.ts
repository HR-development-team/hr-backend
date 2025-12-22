import { Router } from "express";
import { fetchAllAttendances } from "./admin-attendance.controller.js";
import { fetchAttendanceById } from "./employee-attendance.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", fetchAllAttendances);
router.get("/:id", fetchAttendanceById);

export default router;
