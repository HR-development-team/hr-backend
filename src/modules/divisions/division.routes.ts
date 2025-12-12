import { Router } from "express";
import {
  createMasterDivisions,
  destroyMasterDivisions,
  fetchAllMasterDivisions,
  fetchMasterDivisionByCode,
  fetchMasterDivisionsById,
  updateMasterDivisions,
} from "./division.controller.js";
import { verifyToken } from "@middleware/jwt.js";

const router = Router();
router.use(verifyToken);

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
