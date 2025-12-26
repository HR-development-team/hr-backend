import { Router } from "express";
import {
  createMasterDivisions,
  destroyMasterDivisions,
  fetchAllMasterDivisions,
  fetchDivisionOptions,
  fetchMasterDivisionByCode,
  fetchMasterDivisionsById,
  updateMasterDivisions,
} from "./division.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";
import { FEATURES, PERMISSIONS } from "@common/constants/general.js";
import { checkPermission } from "@common/middleware/permissionMiddleware.js";

const router = Router();
router.use(authMiddleware);

const DIV_FEATURE = FEATURES.DIVISION_MANAGEMENT;

// get all
router.get(
  "/",
  checkPermission(DIV_FEATURE, PERMISSIONS.READ),
  fetchAllMasterDivisions
);

// get division options
router.get(
  "/options",
  checkPermission(DIV_FEATURE, PERMISSIONS.READ),
  fetchDivisionOptions
);

// get by id
router.get(
  "/:id",
  checkPermission(DIV_FEATURE, PERMISSIONS.READ),
  fetchMasterDivisionsById
);

// get by code
router.get(
  "/code/:division_code",
  checkPermission(DIV_FEATURE, PERMISSIONS.READ),
  fetchMasterDivisionByCode
);

router.post(
  "/",
  checkPermission(DIV_FEATURE, PERMISSIONS.CREATE),
  createMasterDivisions
);
router.put(
  "/:id",
  checkPermission(DIV_FEATURE, PERMISSIONS.UPDATE),
  updateMasterDivisions
);
router.delete(
  "/:id",
  checkPermission(DIV_FEATURE, PERMISSIONS.DELETE),
  destroyMasterDivisions
);

export default router;
