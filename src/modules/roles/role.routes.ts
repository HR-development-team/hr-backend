import { Router } from "express";
import {
  createRoles,
  destroyRole,
  fetchAllRoles,
  fetchRolesByCode,
  fetchRolesById,
  updateRoles,
} from "./role.controller.js";
import { verifyToken } from "@middleware/jwt.js";

const router = Router();
router.use(verifyToken);

router.get("/", fetchAllRoles);
router.get("/:id", fetchRolesById);
router.get("/code/:code", fetchRolesByCode);
router.post("/", createRoles);
router.put("/:id", updateRoles);
router.delete("/:id", destroyRole);

export default router;
