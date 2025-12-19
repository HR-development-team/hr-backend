import { Router } from "express";
import { fetchEmployeeLeaveBalance } from "./employee-leave-balance.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/me", fetchEmployeeLeaveBalance);

export default router;
