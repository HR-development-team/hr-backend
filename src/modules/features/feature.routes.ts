import { Router } from "express";
import {
  createFeatures,
  destroyFeature,
  fetchAllFeatures,
  fetchFeaturesByCode,
  fetchFeaturesById,
  updateFeatures,
} from "./feature.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", fetchAllFeatures);
router.get("/:id", fetchFeaturesById);
router.get("/code/:code", fetchFeaturesByCode);
router.post("/", createFeatures);
router.put("/:id", updateFeatures);
router.delete("/:id", destroyFeature);

export default router;
