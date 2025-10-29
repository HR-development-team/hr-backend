import { Router } from "express";
import {
  createMasterPositions,
  destroyMasterPositions,
  fetchAllMasterPositions,
  fetchMasterPositionsById,
  updateMasterPositions,
} from "@controllers/masterPositionController.js";
import { verifyToken } from "@middleware/jwt.js";

const router = Router();
router.use(verifyToken);

router.get("/", fetchAllMasterPositions);
router.get("/:id", fetchMasterPositionsById);
router.post("/", createMasterPositions);
router.put("/:id", updateMasterPositions);
router.delete("/:id", destroyMasterPositions);

export default router;
