import { Router } from "express";
import { verifyToken } from "@middleware/jwt.js";
import { fetchUserLeaveBalances } from "@controllers/employeeLeaveBalanceController.js";

const router = Router();
router.use(verifyToken);

router.get("/me", fetchUserLeaveBalances);

export default router;
