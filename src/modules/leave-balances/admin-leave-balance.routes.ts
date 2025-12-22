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
import { FEATURES, PERMISSIONS } from "@common/constants/general.js";
import { checkPermission } from "@common/middleware/permissionMiddleware.js";

const router = Router();
router.use(authMiddleware);

const LEAVE_BALANCE_FEATURE = FEATURES.LEAVE_BALANCE_MANAGEMENT;

// get all leave balances
router.get(
  "/",
  checkPermission(LEAVE_BALANCE_FEATURE, PERMISSIONS.READ),
  fetchAllLeaveBalances
);

// post leave balance
router.post(
  "/",
  checkPermission(LEAVE_BALANCE_FEATURE, PERMISSIONS.CREATE),
  createLeaveBalances
);

// post bulk leave balances
router.post(
  "/bulk",
  checkPermission(LEAVE_BALANCE_FEATURE, PERMISSIONS.CREATE),
  createBulkLeaveBalances
);

// put leave balance by id
router.put(
  "/:id",
  checkPermission(LEAVE_BALANCE_FEATURE, PERMISSIONS.UPDATE),
  updateLeaveBalances
);

// delete bulk leave balances
router.delete(
  "/bulk",
  checkPermission(LEAVE_BALANCE_FEATURE, PERMISSIONS.DELETE),
  destroyBulkLeaveBalances
);

// delete leave balance by id
router.delete(
  "/:id",
  checkPermission(LEAVE_BALANCE_FEATURE, PERMISSIONS.DELETE),
  destroyLeaveBalances
);

export default router;
