import { authMiddleware } from "@common/middleware/authMiddleware.js";
import { Router } from "express";
import {
  createBankAccount,
  updateBankAccountByEmployeeCode,
} from "./bank-account.controller.js";

const router = Router();
router.use(authMiddleware);

// post bank account
router.post("/", createBankAccount);

// updated bank account
router.put("/:employee_code", updateBankAccountByEmployeeCode);

export default router;
