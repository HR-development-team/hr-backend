import { Request, Response } from "express";
import { errorResponse, successResponse } from "@utils/response.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@constants/general.js";
import { appLogger } from "@utils/logger.js";
import { getAllAttendances } from "@modules/attendances/attendance.model.js";
import { toAttendanceSimpleResponse } from "./attendance.helper.js";

/**
 * [GET] /attendances/ - Fetch all employee attendances
 */
export const fetchAllAttendances = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const startDate = (req.query.start_date as string) || "";
    const endDate = (req.query.end_date as string) || "";
    const officeCode = (req.query.office_code as string) || "";
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || "";

    const { data, meta } = await getAllAttendances(
      page,
      limit,
      startDate,
      endDate,
      officeCode,
      search,
      status
    );

    const responseData = data.map(toAttendanceSimpleResponse);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data absensi berhasil di dapatkan",
      responseData,
      200,
      RESPONSE_DATA_KEYS.ATTENDANCES,
      meta
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching departments:${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
