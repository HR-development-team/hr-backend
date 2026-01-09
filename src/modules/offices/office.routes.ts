import { Router } from "express";
import {
  createMasterOffice,
  destroyMasterOffice,
  fetchOfficeList,
  fetchMasterOfficeById,
  updateMasterOffice,
  fetchMasterOfficeByCode,
  fetchOfficeOptions,
} from "./office.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";
import { FEATURES, PERMISSIONS } from "@common/constants/general.js";
import { checkPermission } from "@common/middleware/permissionMiddleware.js";

const router = Router();
router.use(authMiddleware);

const OFFICE_FEATURE = FEATURES.OFFICE_MANAGEMENT;

// 2. Pagination List
router.get(
  "/",
  checkPermission(OFFICE_FEATURE, PERMISSIONS.READ),
  fetchOfficeList
);

// office options
router.get(
  "/options",
  fetchOfficeOptions,
  checkPermission(OFFICE_FEATURE, PERMISSIONS.READ)
);

// 3. Get By Code
router.get(
  "/code/:office_code",
  checkPermission(OFFICE_FEATURE, PERMISSIONS.READ),
  fetchMasterOfficeByCode
);

// 4. Get By ID, Update, Delete (Parameter Dinamis)
// Menggunakan Regex (\\d+) agar hanya menangkap angka
router.get(
  "/:id(\\d+)",
  checkPermission(OFFICE_FEATURE, PERMISSIONS.READ),
  fetchMasterOfficeById
);
router.put(
  "/:id(\\d+)",
  checkPermission(OFFICE_FEATURE, PERMISSIONS.UPDATE),
  updateMasterOffice
);
router.delete(
  "/:id(\\d+)",
  checkPermission(OFFICE_FEATURE, PERMISSIONS.DELETE),
  destroyMasterOffice
);

// 5. Create
router.post(
  "/",
  checkPermission(OFFICE_FEATURE, PERMISSIONS.CREATE),
  createMasterOffice
);

export default router;
