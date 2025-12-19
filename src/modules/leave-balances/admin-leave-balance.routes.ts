import { Router } from "express";

import {
  createBulkLeaveBalances,
  createLeaveBalances,
  destroyBulkLeaveBalances,
  destroyLeaveBalances,
  fetchAllLeaveBalances,
  updateLeaveBalances,
} from "./leave-balance.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", fetchAllLeaveBalances);
router.post("/", createLeaveBalances);
router.post("/bulk", createBulkLeaveBalances);
router.put("/:id", updateLeaveBalances);
router.delete("/bulk", destroyBulkLeaveBalances);
router.delete("/:id", destroyLeaveBalances);

export default router;
