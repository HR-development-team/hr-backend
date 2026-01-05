import { Response, Request } from "express";
import { errorResponse, successResponse } from "@utils/response.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@constants/general.js";
import { appLogger } from "@utils/logger.js";
import {
  getAttendanceById,
  getEmployeeAttendances,
} from "./attendance.model.js";
import { AuthenticatedRequest } from "@common/types/auth.type.js";
import { db } from "@database/connection.js";
import {
  getDailyAttendanceStatusService,
  processCheckIn,
  processCheckOut,
} from "./attendance.service.js";
import { DatabaseError } from "@common/types/error.types.js";

/**
 * [POST] /attendances/check-in - Record Employee Check-In
 */
export const checkIn = async (req: AuthenticatedRequest, res: Response) => {
  const trx = await db.transaction();
  try {
    const currentUser = req.user!;
    const employeeCode = currentUser.employee_code;

    const { latitude, longitude } = req.body;

    if (!employeeCode) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Akun ini tidak terhubung dengan data karyawan",
        401
      );
    }

    if (!latitude || !longitude) {
      await trx.rollback();
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Gagal mendeteksi lokasi. Pastikan GPS aktif",
        400
      );
    }

    const result = await processCheckIn(
      trx,
      employeeCode,
      parseFloat(latitude),
      parseFloat(longitude)
    );

    if (!result.success) {
      await trx.rollback();
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        result.message,
        result.statusCode,
        result.data
      );
    }

    await trx.commit();
    return successResponse(
      res,
      API_STATUS.SUCCESS,
      result.message,
      result.data,
      result.statusCode,
      RESPONSE_DATA_KEYS.ATTENDANCES
    );
  } catch (error) {
    await trx.rollback();
    const dbError = error as DatabaseError;
    appLogger.error(`Error Checking Attendance Session: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan di server",
      500
    );
  }
};

/**
 * [PUT] /attendances/check-out - Record Employee Check-Out
 */
export const checkOut = async (req: AuthenticatedRequest, res: Response) => {
  const trx = await db.transaction();
  try {
    const currentUser = req.user!;
    const employeeCode = currentUser.employee_code;

    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      await trx.rollback();
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Gagal mendeteksi lokasi. Pastikan GPS aktif",
        400
      );
    }

    if (!employeeCode) {
      await trx.rollback();
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Akun ini tidak terhubung data karyawan",
        401
      );
    }

    const result = await processCheckOut(
      trx,
      employeeCode,
      latitude,
      longitude
    );

    if (!result.success) {
      await trx.rollback();
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        result.message,
        result.statusCode
      );
    }

    await trx.commit();

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      result.message,
      result.data,
      result.statusCode
    );
  } catch (error) {
    await trx.rollback();
    const dbError = error as DatabaseError;
    appLogger.error(`Error Check Out: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan server",
      500
    );
  }
};

/**
 * [GET] /attendances/:id - Fetch Attendance by id
 */
export const fetchAttendanceById = async (req: Request, res: Response) => {
  try {
    // Validate and cast the ID params
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID Karyawan tidak valid.",
        400
      );
    }

    const attendances = await getAttendanceById(id);

    if (!attendances) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data absensi tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Abensi berhasil didapatkan",
      attendances,
      200,
      RESPONSE_DATA_KEYS.EMPLOYEES
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching attendance by id: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /attendances/ - Fetch current employee attendance
 */
export const fetchEmployeeAttendance = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const employeeCode = req.user!.employee_code;

  if (!employeeCode) {
    return errorResponse(
      res,
      API_STATUS.UNAUTHORIZED,
      "Akun ini tidak terhubung dengan data pegawai.",
      401
    );
  }

  try {
    const attendances = await getEmployeeAttendances(employeeCode);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Absensi berhasil didapatkan",
      attendances,
      200,
      RESPONSE_DATA_KEYS.ATTENDANCES
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching attendance:${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

export const getTodayAttendanceStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUser = req.user!;
    const employeeCode = currentUser.employee_code;

    if (!employeeCode) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Akun ini tidak terhubung ke data karyawan",
        403
      );
    }

    const statusData = await getDailyAttendanceStatusService(employeeCode);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Status absensi hari ini",
      statusData,
      200
    );
  } catch (error) {
    const dbError = error as DatabaseError;
    appLogger.error(
      `Error fetching current employee attendance status: ${dbError}`
    );

    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
