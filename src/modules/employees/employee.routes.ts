import { Router } from "express";
import {
  createMasterEmployees,
  destroyMasterEmployees,
  fetchAllMasterEmployees,
  fetchMasterEmployeesByCode,
  fetchMasterEmployeesById,
  fetchMasterEmployeesByUserCode,
  updateMasterEmployees,
} from "./employee.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";
import { FEATURES, PERMISSIONS } from "@common/constants/general.js";
import { checkPermission } from "@common/middleware/permissionMiddleware.js";

const router = Router();
router.use(authMiddleware);

const EMP_FEATURE = FEATURES.EMPLOYEE_MANAGEMENT;

// get all employees
router.get(
  "/",
  checkPermission(EMP_FEATURE, PERMISSIONS.READ),
  fetchAllMasterEmployees
);

// get employee by id
router.get(
  "/:id",
  checkPermission(EMP_FEATURE, PERMISSIONS.READ),
  fetchMasterEmployeesById
);

// get employee by employee code
router.get(
  "/code/:employee_code",
  checkPermission(EMP_FEATURE, PERMISSIONS.READ),
  fetchMasterEmployeesByCode
);

// get employee by user code
router.get(
  "/user/:user_code",
  checkPermission(EMP_FEATURE, PERMISSIONS.READ),
  fetchMasterEmployeesByUserCode
);

// post employee
router.post(
  "/",
  checkPermission(EMP_FEATURE, PERMISSIONS.CREATE),
  createMasterEmployees
);

// put employee by id
router.put(
  "/:id",
  checkPermission(EMP_FEATURE, PERMISSIONS.UPDATE),
  updateMasterEmployees
);

// delete employee by id
router.delete(
  "/:id",
  checkPermission(EMP_FEATURE, PERMISSIONS.DELETE),
  destroyMasterEmployees
);

export default router;
