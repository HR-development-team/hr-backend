import { Router } from "express";
import {
  createUsers,
  destroyUsers,
  fetchAllUsers,
  fetchUsersById,
  updateUsers,
} from "./user.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/", fetchAllUsers);
router.get("/:id", fetchUsersById);
router.post("/", createUsers);
router.put("/:id", updateUsers);
router.delete("/:id", destroyUsers);

export default router;
