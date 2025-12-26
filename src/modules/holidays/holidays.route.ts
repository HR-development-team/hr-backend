import { Router } from "express";
import {
  CreateHolidays,
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

// get holidays by id
router.get("/:id", fetchHolidaysById);

// post holidays
router.post("/", CreateHolidays);

// put holidays
router.put("/:id", updateHolidays);

// delete holidays
router.delete("/:id", destroyHolidays);

export default router;
