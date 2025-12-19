import { Router } from "express";
import {
  fetchOrganizationTree,
  fetchPositionList,
  fetchPositionById,
  fetchPositionByCode,
  createMasterPositions,
  updateMasterPosition,
  destroyMasterPositions,
} from "./position.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

// Endpoint Organization Tree (Taruh SEBELUM endpoint /:id agar tidak konflik)
router.get("/organization/:office_id", fetchOrganizationTree);

router.get("/", fetchPositionList);
// ... route CRUD lainnya ...

router.get("/:id", fetchPositionById);
router.get("/code/:position_code", fetchPositionByCode);
router.post("/", createMasterPositions);
router.put("/:id", updateMasterPosition);
router.delete("/:id", destroyMasterPositions);
router.get("/:id", fetchPositionById);

export default router;
