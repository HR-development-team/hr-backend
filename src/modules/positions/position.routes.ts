import { Router } from "express";
import {
  fetchOrganizationTree,
  fetchPositionList,
  fetchPositionById,
  fetchPositionByCode,
  createMasterPositions,
  updateMasterPosition,
  destroyMasterPositions,
  fetchPositionOptions,
  createOfficePosition,
  createDepartmentPosition,
  createDivisionPosition,
} from "./position.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";
import { FEATURES, PERMISSIONS } from "@common/constants/general.js";
import { checkPermission } from "@common/middleware/permissionMiddleware.js";

const router = Router();

router.use(authMiddleware);

const POS_FEATURE = FEATURES.POSITION_MANAGEMENT;

// Endpoint Organization Tree (Taruh SEBELUM endpoint /:id agar tidak konflik)
router.get(
  "/organization/:office_id",
  checkPermission(POS_FEATURE, PERMISSIONS.READ),
  fetchOrganizationTree
);

// get all positions
router.get(
  "/",
  checkPermission(POS_FEATURE, PERMISSIONS.READ),
  fetchPositionList
);

// get positions options
router.get(
  "/options",
  checkPermission(POS_FEATURE, PERMISSIONS.READ),
  fetchPositionOptions
);

// get position by id
router.get(
  "/:id",
  checkPermission(POS_FEATURE, PERMISSIONS.READ),
  fetchPositionById
);

// get position by code
router.get(
  "/code/:position_code",
  checkPermission(POS_FEATURE, PERMISSIONS.READ),
  fetchPositionByCode
);

// create position
router.post(
  "/",
  checkPermission(POS_FEATURE, PERMISSIONS.CREATE),
  createMasterPositions
);

// create office position
router.post(
  "/office",
  checkPermission(POS_FEATURE, PERMISSIONS.CREATE),
  createOfficePosition
);

// create department position
router.post(
  "/department",
  checkPermission(POS_FEATURE, PERMISSIONS.CREATE),
  createDepartmentPosition
);

// create division position
router.post(
  "/division",
  checkPermission(POS_FEATURE, PERMISSIONS.CREATE),
  createDivisionPosition
);

// update position by id
router.put(
  "/:id",
  checkPermission(POS_FEATURE, PERMISSIONS.UPDATE),
  updateMasterPosition
);

// delete position by id
router.delete(
  "/:id",
  checkPermission(POS_FEATURE, PERMISSIONS.DELETE),
  destroyMasterPositions
);

export default router;
