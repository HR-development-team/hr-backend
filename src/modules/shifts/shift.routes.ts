import { Router } from "express";
import {
  createMasterShift,
  destroyMasterShift,
  fetchAllMasterShift,
  fetchMasterShiftById,
  fetchMasterShiftOptions,
  updateMasterShift,
} from "./shift.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";
import { checkPermission } from "@common/middleware/permissionMiddleware.js";
import { FEATURES, PERMISSIONS } from "@common/constants/general.js";

const router = Router();
router.use(authMiddleware);

const SFT_FEATURE = FEATURES.SHIFT_MANAGEMENT;

router.get(
  "/",
  checkPermission(SFT_FEATURE, PERMISSIONS.READ),
  fetchAllMasterShift
);
router.get(
  "/options",
  checkPermission(SFT_FEATURE, PERMISSIONS.READ),
  fetchMasterShiftOptions
);
router.get(
  "/:id",
  checkPermission(SFT_FEATURE, PERMISSIONS.READ),
  fetchMasterShiftById
);
router.post(
  "/",
  checkPermission(SFT_FEATURE, PERMISSIONS.CREATE),
  createMasterShift
);
router.put(
  "/:id",
  checkPermission(SFT_FEATURE, PERMISSIONS.UPDATE),
  updateMasterShift
);
router.delete(
  "/:id",
  checkPermission(SFT_FEATURE, PERMISSIONS.DELETE),
  destroyMasterShift
);

export default router;
