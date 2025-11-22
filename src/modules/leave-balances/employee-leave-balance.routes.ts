import { Router } from "express";
import { verifyToken } from "@middleware/jwt.js";
import { fetchEmployeeLeaveBalance } from "./employee-leave-balance.controller.js";

const router = Router();
router.use(verifyToken);

router.get("/me", fetchEmployeeLeaveBalance);

export default router;
