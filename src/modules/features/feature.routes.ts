import { Router } from "express";
import {
  createFeatures,
  destroyFeature,
  fetchAllFeatures,
  fetchFeaturesByCode,
  fetchFeaturesById,
  updateFeatures,
} from "./feature.controller.js";
import { verifyToken } from "@middleware/jwt.js";

const router = Router();
router.use(verifyToken);

router.get("/", fetchAllFeatures);
router.get("/:id", fetchFeaturesById);
router.get("/code/:code", fetchFeaturesByCode);
router.post("/", createFeatures);
router.put("/:id", updateFeatures);
router.delete("/:id", destroyFeature);

export default router;
