import { Router } from "express";
import {
  createMasterOffice,
  destroyMasterOffice,
  // fetchAllMasterOffices,
  fetchOfficeList,
  fetchMasterOfficeById,
  updateMasterOffice,
  fetchOrganizationTree,
} from "./office.controller.js";
import { verifyToken } from "@middleware/jwt.js";

const router = Router();
router.use(verifyToken);

router.get("/organization", fetchOrganizationTree);

router.get("/", fetchOfficeList);

router.get("/:id(\\d+)", fetchMasterOfficeById);
router.put("/:id(\\d+)", updateMasterOffice);
router.delete("/:id(\\d+)", destroyMasterOffice);

router.post("/", createMasterOffice);
export default router;
