import { Router } from "express";
import { getProfile, loginUser, logoutUser } from "./auth.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();

router.post("/login", loginUser);
router.get("/me", authMiddleware, getProfile);

router.delete("/logout", authMiddleware, logoutUser);

export default router;
