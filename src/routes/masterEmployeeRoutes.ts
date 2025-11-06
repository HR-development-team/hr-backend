import { Router } from "express";

// --- PERBAIKI IMPORT: HANYA GUNAKAN FUNGSI DARI MASTEREMPLOYEECONTROLLER ---
import {
<<<<<<< Updated upstream
  createMasterEmployees,
  destroyMasterEmployees,
  fetchAllMasterEmployees,
  fetchMasterEmployeesById,
  updateMasterEmployees,
} from "@controllers/masterEmployeeController.js";
import { verifyToken } from "@middleware/jwt.js";
=======
  fetchAllMasterEmployees,
  fetchMasterEmployeesById,
  createMasterEmployees,
  updateMasterEmployees,
  destroyMasterEmployees,
} from "@controllers/masterEmployeeController.js";

import { verifyToken } from "@middleware/jwt.js"; // Melindungi rute
>>>>>>> Stashed changes

const router = Router();
router.use(verifyToken);

<<<<<<< Updated upstream
router.get("/", fetchAllMasterEmployees);
router.get("/:id", fetchMasterEmployeesById);
router.post("/", createMasterEmployees);
router.put("/:id", updateMasterEmployees);
router.delete("/:id", destroyMasterEmployees);
=======
// --- PERBAIKI SEMUA KONEKSI ROUTE ---

// [GET] /api/v1/master-employees/ -> Dapat semua karyawan
router.get("/", fetchAllMasterEmployees); // Fungsi ini untuk mengambil SEMUA

// [POST] /api/v1/master-employees/ -> Buat karyawan baru
router.post("/", createMasterEmployees); // Fungsi ini untuk MEMBUAT

// [GET] /api/v1/master-employees/:id -> Dapat satu karyawan
router.get("/:id", fetchMasterEmployeesById); // Fungsi ini untuk mengambil SATU DENGAN ID

// [PUT] /api/v1/master-employees/:id -> Update satu karyawan
router.put("/:id", updateMasterEmployees); // Fungsi ini untuk MENGUPDATE

// [DELETE] /api/v1/master-employees/:id -> Hapus satu karyawan
router.delete("/:id", destroyMasterEmployees); // Fungsi ini untuk MENGHAPUS
>>>>>>> Stashed changes

export default router;
