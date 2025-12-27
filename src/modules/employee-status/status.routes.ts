// status.routes.ts
import { Router } from "express";
import {
  createEmploymentStatus,
  destroyEmploymentStatus,
  fetchAllEmploymentStatuses,
  fetchEmploymentStatusByCode,
  fetchEmploymentStatusById,
  fetchEmploymentStatusOptions,
  updateEmploymentStatus,
} from "./status.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", fetchAllEmploymentStatuses);
router.get("/options", fetchEmploymentStatusOptions);
router.get("/:id", fetchEmploymentStatusById);
router.get("/code/:status_code", fetchEmploymentStatusByCode);

router.post("/", createEmploymentStatus);
router.put("/:id", updateEmploymentStatus);
router.delete("/:id", destroyEmploymentStatus);

export default router;
