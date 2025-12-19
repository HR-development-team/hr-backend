import { Router } from "express";
import {
  createPayrollPeriods,
  destroyPayrollPeriods,
  fetchAllPayrollPeriods,
  fetchPayrollPeriodsById,
  updateStatusPayrollPeriods,
} from "./payroll-period.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", fetchAllPayrollPeriods);
router.get("/:id", fetchPayrollPeriodsById);
router.post("/", createPayrollPeriods);
router.put("/:id/status", updateStatusPayrollPeriods);
router.delete("/:id", destroyPayrollPeriods);

export default router;
