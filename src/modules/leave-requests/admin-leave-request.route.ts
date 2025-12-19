import { Router } from "express";
import {
  destroyLeaveRequest,
  fetchAllLeaveRequest,
  fetchLeaveRequestById,
  updateLeaveRequestStatus,
} from "./admin-leave-request.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", fetchAllLeaveRequest);
router.get("/:id", fetchLeaveRequestById);
router.put("/:id/status", updateLeaveRequestStatus);
router.delete("/:id", destroyLeaveRequest);

export default router;
