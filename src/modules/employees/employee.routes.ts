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
import { verifyToken } from "@middleware/jwt.js";

const router = Router();
router.use(verifyToken);

router.get("/", fetchAllMasterEmployees);
router.get("/:id", fetchMasterEmployeesById);
router.get("/code/:employee_code", fetchMasterEmployeesByCode);
router.get("/user/:user_code", fetchMasterEmployeesByUserCode);

router.post("/", createMasterEmployees);
router.put("/:id", updateMasterEmployees);
router.delete("/:id", destroyMasterEmployees);

export default router;
