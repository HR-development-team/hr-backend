import { Router } from "express";
import {
  checkIn,
  checkOut,
  fetchEmployeeAttendance,
} from "./employee-attendance.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

router.post("/check-in", checkIn);
router.put("/check-out", checkOut);
router.get("/", fetchEmployeeAttendance);

export default router;
