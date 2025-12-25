import { Router } from "express";
import { fetchAllHolidays, fetchHolidaysById } from "./holidays.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware)

// get all holidays
router.get("/", fetchAllHolidays);

// get holidays by id
router.get("/:id", fetchHolidaysById);

export default router;
