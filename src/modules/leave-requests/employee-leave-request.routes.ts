import { Router } from "express";
import { verifyToken } from "@middleware/jwt.js";
import {
  createLeaveRequest,
  fetchEmployeeLeaveRequest,
} from "./employee-leave-request.controller.js";

const router = Router();
router.use(verifyToken);

router.post("/", createLeaveRequest);
router.get("/me", fetchEmployeeLeaveRequest);

export default router;
