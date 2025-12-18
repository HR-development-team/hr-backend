// status.routes.ts
import { Router } from "express";
import {
  createEmploymentStatus,
  destroyEmploymentStatus,
  fetchAllEmploymentStatuses,
  fetchEmploymentStatusByCode,
  fetchEmploymentStatusById,
  updateEmploymentStatus,
} from "./status.controller.js";
import { verifyToken } from "@middleware/jwt.js";

const router = Router();
router.use(verifyToken);

router.get("/", fetchAllEmploymentStatuses);
router.get("/:id", fetchEmploymentStatusById);
router.get("/code/:status_code", fetchEmploymentStatusByCode);

router.post("/", createEmploymentStatus);
router.put("/:id", updateEmploymentStatus);
router.delete("/:id", destroyEmploymentStatus);

export default router;