// employeePhoto.routes.ts
import { Router } from "express";
import {
  uploadEmployeePhoto,
  fetchEmployeePhoto,
  destroyEmployeePhoto,
} from "./employeePhoto.controller.js";
import { uploadPhoto } from "./employeePhoto.helper.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.get("/:employee_code", fetchEmployeePhoto);
router.use(authMiddleware);
router.post("/:employee_code", uploadPhoto.single("photo"), uploadEmployeePhoto);
router.delete("/:employee_code", destroyEmployeePhoto);

export default router;