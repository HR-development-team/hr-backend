import { Router } from "express";
import {
  createHolidays,
  destroyHolidays,
  fetchAllHolidays,
  fetchHolidaysById,
  updateHolidays,
} from "./holidays.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

// get all holidays
router.get("/", fetchAllHolidays);

// post holidays
router.post("/", createHolidays);

// get holidays by id
router.get("/:id", fetchHolidaysById);

// put holidays
router.put("/:id", updateHolidays);

// delete holidays
router.delete("/:id", destroyHolidays);

export default router;
