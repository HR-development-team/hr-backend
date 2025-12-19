import { Router } from "express";
import {
  createAttendanceSessions,
  destroyAttendanceSessions,
  fetchAllAttendanceSessions,
  fetchAttendanceSessionsById,
  updateAttendanceSessions,
  updateAttendanceSessionsStatus,
} from "./session.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", fetchAllAttendanceSessions);
router.get("/:id", fetchAttendanceSessionsById);
router.post("/", createAttendanceSessions);
router.put("/:id", updateAttendanceSessions);
router.put("/:id/status", updateAttendanceSessionsStatus);
router.delete("/:id", destroyAttendanceSessions);

export default router;
