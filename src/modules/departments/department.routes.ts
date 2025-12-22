import { Router } from "express";
import {
  createMasterDepartments,
  destroyMasterDepartments,
  fetchAllMasterDepartments,
  fetchMasterDepartmentsById,
  updateMasterDepartments,
  fetchMasterDepartmentByCode,
} from "./department.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";
import { checkPermission } from "@common/middleware/permissionMiddleware.js";
import { FEATURES, PERMISSIONS } from "@common/constants/general.js";

const router = Router();
router.use(authMiddleware);

const DEPT_FEATURE = FEATURES.DEPARTMENT_MANAGEMENT;

// get all departemen
router.get(
  "/",
  checkPermission(DEPT_FEATURE, PERMISSIONS.READ),
  fetchAllMasterDepartments
);

// get by dept code
router.get(
  "/code/:department_code",
  checkPermission(DEPT_FEATURE, PERMISSIONS.READ),
  fetchMasterDepartmentByCode
);

// get by dept id
router.get(
  "/:id",
  checkPermission(DEPT_FEATURE, PERMISSIONS.READ),
  fetchMasterDepartmentsById
);

// post dept
router.post(
  "/",
  checkPermission(DEPT_FEATURE, PERMISSIONS.CREATE),
  createMasterDepartments
);

// put by dept id
router.put(
  "/:id",
  checkPermission(DEPT_FEATURE, PERMISSIONS.UPDATE),
  updateMasterDepartments
);

// delete by dept id
router.delete(
  "/:id",
  checkPermission(DEPT_FEATURE, PERMISSIONS.DELETE),
  destroyMasterDepartments
);

export default router;
