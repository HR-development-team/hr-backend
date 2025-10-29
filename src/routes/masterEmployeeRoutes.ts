import { Router } from "express";
import {
  createMasterEmployees,
  destroyMasterEmployees,
  fetchAllMasterEmployees,
  fetchMasterEmployeesById,
  updateMasterEmployees,
} from "@controllers/masterEmployeeController.js";
import { verifyToken } from "@middleware/jwt.js";

const router = Router();
router.use(verifyToken);

router.get("/", fetchAllMasterEmployees);
router.get("/:id", fetchMasterEmployeesById);
router.post("/", createMasterEmployees);
router.put("/:id", updateMasterEmployees);
router.delete("/:id", destroyMasterEmployees);

export default router;
