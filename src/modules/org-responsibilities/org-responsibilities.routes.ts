import { authMiddleware } from "@common/middleware/authMiddleware.js";
import { Router } from "express";
import {
  createOrgResponsibilities,
  destroyOrgResponsibilities,
  fetchAllOrgResponsibilities,
  fetchOrgResponsibilitiesById,
  unassignOrgResponsibilities,
  updateOrgResponsibilities,
} from "./org-responsibilities.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/", fetchAllOrgResponsibilities);

router.post("/assign-leader", createOrgResponsibilities);

router.post("/unassign-leader", unassignOrgResponsibilities);

router.get("/:id", fetchOrgResponsibilitiesById);

router.put("/:id", updateOrgResponsibilities);

router.delete("/:id", destroyOrgResponsibilities);

export default router;
