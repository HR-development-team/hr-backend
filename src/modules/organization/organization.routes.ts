import { authMiddleware } from "@common/middleware/authMiddleware.js";
import { Router } from "express";
import {
  fetchOfficeStructure,
  fetchOrganizationStructure,
} from "./organization.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/organization/:office_code", fetchOrganizationStructure);
router.get("/organization", fetchOfficeStructure);

export default router;
