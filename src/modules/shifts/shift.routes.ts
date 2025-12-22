import { Router } from "express";
import {
  createMasterShift,
  destroyMasterShift,
  fetchAllMasterShift,
  fetchMasterShiftById,
  updateMasterShift,
} from "./shift.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", fetchAllMasterShift);
router.get("/:id", fetchMasterShiftById);
router.post("/", createMasterShift);
router.put("/:id", updateMasterShift);
router.delete("/:id", destroyMasterShift);

export default router;
