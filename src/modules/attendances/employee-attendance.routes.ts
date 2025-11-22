import { Router } from "express";
import {
  checkIn,
  checkOut,
  fetchEmployeeAttendance,
} from "./employee-attendance.controller.js";
import { verifyToken } from "@middleware/jwt.js";

const router = Router();
router.use(verifyToken);

router.post("/check-in", checkIn);
router.put("/check-out", checkOut);
router.get("/", fetchEmployeeAttendance);

export default router;
