import { Router } from "express";
import { fetchAllAttendances } from "./admin-attendance.controller.js";
import { verifyToken } from "@middleware/jwt.js";
import { fetchAttendanceById } from "./employee-attendance.controller.js";

const router = Router();
router.use(verifyToken);

router.get("/", fetchAllAttendances);
router.get("/:id", fetchAttendanceById);

export default router;
