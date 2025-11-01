import { Router } from "express";
import {
  getProfile,
  loginUser,
  logoutUser,
} from "@controllers/authController.js";
import { verifyToken } from "@middleware/jwt.js";

const router = Router();

router.post("/login", loginUser);
router.get("/me", verifyToken, getProfile);
router.delete("/logout", verifyToken, logoutUser);

export default router;
