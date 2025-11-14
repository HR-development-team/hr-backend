import { Router } from "express";
import { verifyToken } from "@middleware/jwt.js";
import {
  destroyLeaveRequest,
  fetchAllLeaveRequest,
  fetchLeaveRequestById,
  updateLeaveRequestStatus,
} from "@controllers/adminLeaveRequestController.js";

const router = Router();
router.use(verifyToken);

router.get("/", fetchAllLeaveRequest);
router.get("/:id", fetchLeaveRequestById);
router.put("/:id/status", updateLeaveRequestStatus);
router.delete("/:id", destroyLeaveRequest);

export default router;
