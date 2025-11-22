import { Router } from "express";
import {
  createMasterOffice,
  destroyMasterOffice,
  fetchAllMasterOffices,
  fetchMasterOfficeById,
  updateMasterOffice,
} from "./office.controller.js";
import { verifyToken } from "@middleware/jwt.js";

const router = Router();
router.use(verifyToken);

router.get("/", fetchAllMasterOffices);
router.get("/:id", fetchMasterOfficeById);
router.post("/", createMasterOffice);
router.put("/:id", updateMasterOffice);
router.delete("/:id", destroyMasterOffice);

export default router;
