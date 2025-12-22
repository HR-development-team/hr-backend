import { Router } from "express";
import {
  destroyLeaveRequest,
  fetchAllLeaveRequest,
  fetchLeaveRequestById,
  updateLeaveRequestStatus,
} from "./admin-leave-request.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";
import { FEATURES, PERMISSIONS } from "@common/constants/general.js";
import { checkPermission } from "@common/middleware/permissionMiddleware.js";

const router = Router();
router.use(authMiddleware);

const LEAVE_REQUEST_FEATURE = FEATURES.LEAVE_REQUEST_MANAGEMENT;

// get all leave requests
router.get(
  "/",
  checkPermission(LEAVE_REQUEST_FEATURE, PERMISSIONS.READ),
  fetchAllLeaveRequest
);

// get leave request by id
router.get(
  "/:id",
  checkPermission(LEAVE_REQUEST_FEATURE, PERMISSIONS.READ),
  fetchLeaveRequestById
);

// update leave request status by id
router.put(
  "/:id/status",
  checkPermission(LEAVE_REQUEST_FEATURE, PERMISSIONS.UPDATE),
  updateLeaveRequestStatus
);

// delete leave request by id
router.delete(
  "/:id",
  checkPermission(LEAVE_REQUEST_FEATURE, PERMISSIONS.DELETE),
  destroyLeaveRequest
);

export default router;
