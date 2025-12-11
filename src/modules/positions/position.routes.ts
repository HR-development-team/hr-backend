import { Router } from "express";
import { verifyToken } from "@middleware/jwt.js";
import {
  fetchOrganizationTree,
  fetchPositionList,
  fetchPositionById,
} from "./position.controller.js";

const router = Router();

router.use(verifyToken);

// Endpoint Organization Tree (Taruh SEBELUM endpoint /:id agar tidak konflik)
router.get("/organization/:office_id", fetchOrganizationTree);

router.get("/", fetchPositionList);
// ... route CRUD lainnya ...

router.get("/:id", fetchPositionById);
export default router;
