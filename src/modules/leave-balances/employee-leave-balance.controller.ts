import { Response } from "express";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@constants/general.js";
import { errorResponse, successResponse } from "@utils/response.js";
import { appLogger } from "@utils/logger.js";
import { DatabaseError } from "@apptypes/error.types.js";
import { AuthenticatedRequest } from "@middleware/jwt.js";
import { getMasterEmployeesByCode } from "@modules/employees/employee.model.js";
import { getAllEmployeeLeaveBalance } from "./leave-balance.model.js";

/**
 * [GET] /leave-balances/me - Get current employee leave balances
 */
export const fetchEmployeeLeaveBalance = async (
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
    // check if the employee exist or not in database
    const profile = await getMasterEmployeesByCode(employeeCode);

    if (!profile) {
      appLogger.error(
        `FATAL: User code ${req.user!.user_code} has no linked Employee profile.`
      );
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Profil pegawai tidak ditemukan.",
        404
      );
    }

    // Get current user leave balance
    const leaveBalances = await getAllEmployeeLeaveBalance(employeeCode);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data sisa cuti user berhasil didapatkan",
      leaveBalances,
      201,
      RESPONSE_DATA_KEYS.LEAVE_BALANCES
    );
  } catch (error) {
    const dbError = error as DatabaseError;

    appLogger.error(`Error creating fetch leave balances:${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
