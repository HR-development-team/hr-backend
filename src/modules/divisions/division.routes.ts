import { Router } from "express";
import {
  createMasterDivisions,
  destroyMasterDivisions,
  fetchAllMasterDivisions,
  fetchMasterDivisionByCode,
  fetchMasterDivisionsById,
  updateMasterDivisions,
} from "./division.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

// get all
router.get("/", fetchAllMasterDivisions);

// get by id
router.get("/:id", fetchMasterDivisionsById);

// get by code
router.get("/code/:division_code", fetchMasterDivisionByCode);

router.post("/", createMasterDivisions);
router.put("/:id", updateMasterDivisions);
router.delete("/:id", destroyMasterDivisions);

export default router;
