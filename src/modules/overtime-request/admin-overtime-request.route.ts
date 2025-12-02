import { Router } from "express";
import { verifyToken } from "@middleware/jwt.js";
import {
  destroyOvertimeRequest,
  fetchAllOvertimeRequest,
  fetchOvertimeRequestById,
  updateOvertimeRequestStatus,
} from "./admin-overtime-request.controller.js";

const router = Router();
// Pastikan middleware verifyToken aktif agar req.user terisi
router.use(verifyToken);

router.get("/", fetchAllOvertimeRequest);
router.get("/:id", fetchOvertimeRequestById);
router.put("/:id/status", updateOvertimeRequestStatus);
router.delete("/:id", destroyOvertimeRequest);

export default router;
