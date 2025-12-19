import { Router } from "express";
import {
  createRoles,
  destroyRole,
  fetchAllRoles,
  fetchRolesByCode,
  fetchRolesById,
  updateRoles,
} from "./role.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", fetchAllRoles);
router.get("/:id", fetchRolesById);
router.get("/code/:code", fetchRolesByCode);
router.post("/", createRoles);
router.put("/:id", updateRoles);
router.delete("/:id", destroyRole);

export default router;
