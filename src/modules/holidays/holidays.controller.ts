import { Request, Response } from "express";
import { getAllHolidays, getHolidayById } from "./holidays.model.js";
import { errorResponse, successResponse } from "@common/utils/response.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@common/constants/general.js";
import { appLogger } from "@common/utils/logger.js";

/**
 * [GET] /holidays = Fetch all Holidays
 */
export const fetchAllHolidays = async (req: Request, res: Response) => {
  try {
    const officeCode = req.query.office_code as string | "";

    const holidays = await getAllHolidays(officeCode);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data hari libur berhasil didapatkan",
      holidays,
      200,
      RESPONSE_DATA_KEYS.HOLIDAYS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching holidays: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /holidays/:id = Fetch Holiday by id
 */
export const fetchHolidaysById = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Id hari libur tidak valid",
        400
      );
    }

    const holidays = await getHolidayById(id);

    if (!holidays) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data hari libur tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data hari libur berhasil didapatkan",
      holidays,
      200,
      RESPONSE_DATA_KEYS.HOLIDAYS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching holidays: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
