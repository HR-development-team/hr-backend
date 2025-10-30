import { Router } from "express";
import {
  createUsers,
  destroyUsers,
  fetchAllUsers,
  fetchUsersById,
  updateUsers,
} from "@controllers/userController.js";
import { verifyToken } from "@middleware/jwt.js";

const router = Router();
router.use(verifyToken);

router.get("/", fetchAllUsers);
router.get("/:id", fetchUsersById);
router.post("/", createUsers);
router.put("/:id", updateUsers);
router.delete("/:id", destroyUsers);

export default router;
