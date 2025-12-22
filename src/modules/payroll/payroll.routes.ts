import { Router } from "express";
import {
  destroyPayrolls,
  fetchAllPayrolls,
  fetchPayrollsById,
  generateAllPayroll,
  updatePayroll,
} from "./payroll.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

router.post("/generate", generateAllPayroll);
router.get("/", fetchAllPayrolls);
router.get("/:id", fetchPayrollsById);
router.put("/:id", updatePayroll);
router.delete("/:id", destroyPayrolls);

export default router;
