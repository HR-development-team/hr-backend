import { Router } from "express";
import {
  fetchEmployeeProfile,
  updateEmployeeProfile,
} from "./profile.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", fetchEmployeeProfile);
router.put("/", updateEmployeeProfile);

export default router;
