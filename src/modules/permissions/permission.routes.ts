import { Router } from "express";
import {
  getCurrentUserPermission,
  getPermissionByRoleCode,
  updatePermissionByRoleCode,
} from "./permission.controller.js";
import { verifyToken } from "@middleware/jwt.js";

const router = Router();
router.use(verifyToken);

router.get("/me", getCurrentUserPermission);
router.get("/role/:role_code", getPermissionByRoleCode);
router.put("/role/:role_code", updatePermissionByRoleCode);

export default router;
