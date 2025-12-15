import { Router } from "express";
import { verifyToken } from "@middleware/jwt.js";
import {
  fetchOrganizationTree,
  fetchPositionList,
  fetchPositionById,
  fetchPositionByCode,
  createNewPosition,
  updatePositionDetails,
  deletePositionDetails,
} from "./position.controller.js";

const router = Router();

router.use(verifyToken);

// Endpoint Organization Tree (Taruh SEBELUM endpoint /:id agar tidak konflik)
router.get("/organization/:office_id", fetchOrganizationTree);

router.get("/", fetchPositionList);
// ... route CRUD lainnya ...

router.get("/:id", fetchPositionById);
router.get("/code/:position_code", fetchPositionByCode);
router.post("/", createNewPosition);
router.put("/:id", updatePositionDetails);
router.delete("/:id", deletePositionDetails);
router.get("/:id", fetchPositionById);

export default router;
