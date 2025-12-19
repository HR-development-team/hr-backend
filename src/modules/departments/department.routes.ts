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

const router = Router();
router.use(authMiddleware);

router.get("/", fetchAllMasterDepartments);
router.get("/code/:department_code", fetchMasterDepartmentByCode);
router.get("/:id", fetchMasterDepartmentsById);
router.post("/", createMasterDepartments);
router.put("/:id", updateMasterDepartments);
router.delete("/:id", destroyMasterDepartments);

export default router;
