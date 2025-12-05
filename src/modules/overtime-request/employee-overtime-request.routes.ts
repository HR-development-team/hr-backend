import { Router } from "express";
import { verifyToken } from "@middleware/jwt.js";
import {
  createOvertimeRequest,
  fetchEmployeeOvertimeRequest,
} from "./employee-overtime-request.controller.js";

const router = Router();
router.use(verifyToken);

router.post("/", createOvertimeRequest);
router.get("/me", fetchEmployeeOvertimeRequest);

export default router;
