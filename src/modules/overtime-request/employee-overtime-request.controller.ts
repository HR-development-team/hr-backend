import { Response } from "express";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@constants/general.js";
import { errorResponse, successResponse } from "@utils/response.js";
import { appLogger } from "@utils/logger.js";
import { AuthenticatedRequest } from "@middleware/jwt.js";
import {
  addOvertimeRequest,
  getAllOvertimeRequests,
} from "./overtime-request.model.js";
import { addOvertimeRequestSchema } from "./overtime-request.schemas.js";

const calculateDurationMinutes = (start: string, end: string): number => {
  const [startHour, startMin] = start.split(":").map(Number);
  const [endHour, endMin] = end.split(":").map(Number);
  return endHour * 60 + endMin - (startHour * 60 + startMin);
};

export const fetchEmployeeOvertimeRequest = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  // Asumsi di JWT middleware kamu menaruh id user di req.user.id
  const userCode = req.user!.user_code;

  if (!userCode) {
    return errorResponse(res, API_STATUS.UNAUTHORIZED, "Unauthorized", 401);
  }

  try {
    const requests = await getAllOvertimeRequests({ userCode });
    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Riwayat lembur berhasil didapatkan.",
      requests,
      200,
      RESPONSE_DATA_KEYS.OVERTIME_REQUESTS
    );
  } catch (error) {
    appLogger.error(`Error fetching overtime request:${error}`);
    return errorResponse(res, API_STATUS.FAILED, "Server Error", 500);
  }
};

export const createOvertimeRequest = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userCode = req.user!.user_code;

  if (!userCode) {
    return errorResponse(res, API_STATUS.UNAUTHORIZED, "Unauthorized", 401);
  }

  try {
    const validation = addOvertimeRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Validasi gagal",
        400,
        validation.error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        }))
      );
    }

    const { overtime_date, start_time, end_time, reason } = validation.data;
    const durationMinutes = calculateDurationMinutes(start_time, end_time);

    const newRequest = await addOvertimeRequest({
      employee_code: userCode,
      overtime_date,
      start_time,
      end_time,
      duration: durationMinutes,
      reason,
    });

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Pengajuan lembur berhasil dikirim.",
      newRequest,
      201,
      RESPONSE_DATA_KEYS.OVERTIME_REQUESTS
    );
  } catch (error) {
    appLogger.error(`Error submitting overtime request:${error}`);
    return errorResponse(res, API_STATUS.FAILED, "Server Error", 500);
  }
};
