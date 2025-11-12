import { Router } from "express";
import { fetchAllAttendances } from "@controllers/adminAttendanceController.js";
import { verifyToken } from "@middleware/jwt.js";
import { fetchAttendanceById } from "@controllers/employeeAttendanceController.js";

const router = Router();
router.use(verifyToken);

router.get("/", fetchAllAttendances);
router.get("/:id", fetchAttendanceById);

export default router;
