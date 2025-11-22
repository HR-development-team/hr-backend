import { Router } from "express";
import { verifyToken } from "@middleware/jwt.js";
import {
  fetchEmployeeProfile,
  updateEmployeeProfile,
} from "./profile.controller.js";

const router = Router();
router.use(verifyToken);

router.get("/", fetchEmployeeProfile);
router.put("/", updateEmployeeProfile);

export default router;
