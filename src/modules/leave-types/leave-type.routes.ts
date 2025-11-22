import { Router } from "express";
import { verifyToken } from "@middleware/jwt.js";
import {
  fetchAllMasterLeaveTypes,
  fetchMasterLeaveTypesById,
  createMasterLeaveTypes,
  updateMasterLeaveTypes,
  destroyMasterLeaveTypes,
} from "./leave-type.controller.js";

const router = Router();
router.use(verifyToken);

router.get("/", fetchAllMasterLeaveTypes);
router.get("/:id", fetchMasterLeaveTypesById);
router.post("/", createMasterLeaveTypes);
router.put("/:id", updateMasterLeaveTypes);
router.delete("/:id", destroyMasterLeaveTypes);

export default router;
