import { Router } from "express";
import {
  fetchAllMasterLeaveTypes,
  fetchMasterLeaveTypesById,
  createMasterLeaveTypes,
  updateMasterLeaveTypes,
  destroyMasterLeaveTypes,
} from "./leave-type.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", fetchAllMasterLeaveTypes);
router.get("/:id", fetchMasterLeaveTypesById);
router.post("/", createMasterLeaveTypes);
router.put("/:id", updateMasterLeaveTypes);
router.delete("/:id", destroyMasterLeaveTypes);

export default router;
