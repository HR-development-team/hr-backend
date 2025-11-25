import { Router } from "express";
import {
  createMasterShift,
  destroyMasterShift,
  fetchAllMasterShift,
  fetchMasterShiftById,
  updateMasterShift,
} from "./shift.controller.js";
import { verifyToken } from "@middleware/jwt.js";

const router = Router();
router.use(verifyToken);

router.get("/", fetchAllMasterShift);
router.get("/:id", fetchMasterShiftById);
router.post("/", createMasterShift);
router.put("/:id", updateMasterShift);
router.delete("/:id", destroyMasterShift);

export default router;
