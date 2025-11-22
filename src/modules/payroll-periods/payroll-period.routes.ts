import { Router } from "express";
import { verifyToken } from "@middleware/jwt.js";
import {
  createPayrollPeriods,
  destroyPayrollPeriods,
  fetchAllPayrollPeriods,
  fetchPayrollPeriodsById,
  updateStatusPayrollPeriods,
} from "./payroll-period.controller.js";

const router = Router();
router.use(verifyToken);

router.get("/", fetchAllPayrollPeriods);
router.get("/:id", fetchPayrollPeriodsById);
router.post("/", createPayrollPeriods);
router.put("/:id/status", updateStatusPayrollPeriods);
router.delete("/:id", destroyPayrollPeriods);

export default router;
