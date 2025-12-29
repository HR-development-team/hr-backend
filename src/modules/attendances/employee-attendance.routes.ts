import { Router } from "express";
import {
  checkIn,
  checkOut,
  fetchEmployeeAttendance,
  getTodayAttendanceStatus,
} from "./employee-attendance.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

router.post("/check-in", checkIn);
router.put("/check-out", checkOut);
router.get("/", fetchEmployeeAttendance);
router.get("/today-status", getTodayAttendanceStatus);

export default router;
