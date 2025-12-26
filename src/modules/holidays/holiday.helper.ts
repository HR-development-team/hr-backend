import { format } from "date-fns";
import { GetAllHolidays, Holiday } from "./holidays.types.js";
import { Response } from "express";
import { DatabaseError } from "@common/types/error.types.js";
import { appLogger } from "@common/utils/logger.js";
import { errorResponse } from "@common/utils/response.js";
import { API_STATUS } from "@common/constants/general.js";

export const toHolidaySimpleResponse = (
  holiday: GetAllHolidays
): GetAllHolidays => ({
  id: holiday.id,
  office_code: holiday.office_code,
  date: format(new Date(holiday.date), "yyyy-MM-dd"),
  description: holiday.description,
});

export const toHolidayDetailResponse = (holiday: Holiday): Holiday => ({
  ...toHolidaySimpleResponse(holiday),
  created_at: holiday.created_at,
  updated_at: holiday.updated_at,
});

export const handleDatabaseError = (
  res: Response,
  error: unknown,
  context: string
) => {
  const dbError = error as DatabaseError;

  if (dbError.code === "ER_DUP_ENTRY" || dbError.errno === 1062) {
    if (dbError.message?.includes("unique_holidays_scope")) {
      appLogger.warn(`${context} failed: Duplicate date and office code`);
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Data Konflik: Hari libur untuk tanggal dan kantor tersebut sudah terdaftar",
        400
      );
    }
    return errorResponse(
      res,
      API_STATUS.BAD_REQUEST,
      "Data sudah ada di database (Duplikat)",
      400
    );
  }

  appLogger.error(`Error ${context}: ${dbError}`);
  return errorResponse(res, API_STATUS.FAILED, "Terjadi kesalahan server", 500);
};

export const parseIdParams = (paramsId: string): number | null => {
  const id = parseInt(paramsId, 10);
  return isNaN(id) ? null : id;
};
