import { Router } from "express";
import {
  createMasterOffice,
  destroyMasterOffice,
  fetchOfficeList,
  fetchMasterOfficeById,
  updateMasterOffice,
  fetchOrganizationTree,
  fetchMasterOfficeByCode,
  fetchOfficeReference,
} from "./office.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

// 1. Organization Tree (WAJIB PALING ATAS)
// Agar tidak tertangkap oleh /:id
router.get("/organization", fetchOrganizationTree);

// 2. Pagination List
router.get("/", fetchOfficeList);

// office reference
router.get("/reference", fetchOfficeReference);

// 3. Get By Code
router.get("/code/:office_code", fetchMasterOfficeByCode);

// 4. Get By ID, Update, Delete (Parameter Dinamis)
// Menggunakan Regex (\\d+) agar hanya menangkap angka
router.get("/:id(\\d+)", fetchMasterOfficeById);
router.put("/:id(\\d+)", updateMasterOffice);
router.delete("/:id(\\d+)", destroyMasterOffice);

// 5. Create
router.post("/", createMasterOffice);

export default router;
