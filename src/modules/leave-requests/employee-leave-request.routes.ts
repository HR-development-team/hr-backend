import { Router } from "express";
import {
  createLeaveRequest,
  fetchEmployeeLeaveRequest,
} from "./employee-leave-request.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

router.post("/", createLeaveRequest);
router.get("/me", fetchEmployeeLeaveRequest);

export default router;
