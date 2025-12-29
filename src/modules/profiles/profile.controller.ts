import { Response } from "express";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@constants/general.js";
import { appLogger } from "@utils/logger.js";
import { errorResponse, successResponse } from "@utils/response.js";
import { AuthenticatedRequest } from "@common/types/auth.type.js";
import {
  editMasterEmployeesByCode,
  getMasterEmployeesByCode,
} from "@modules/employees/employee.model.js";
import { updateProfileSchema } from "./profile.schemas.js";
import { getRoleByCode } from "@modules/roles/role.model.js";

/**
 * [GET] /profile - Fetch employee profile
 */
export const fetchEmployeeProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const employeeCode = req.user!.employee_code;
  const roleCode = req.user!.role_code;

  if (!employeeCode) {
    return errorResponse(
      res,
      API_STATUS.UNAUTHORIZED,
      "Akun ini tidak terhubung dengan data pegawai.",
      401
    );
  }

  try {
    const employee = await getMasterEmployeesByCode(employeeCode);
    const role = await getRoleByCode(roleCode);

    if (!employee) {
      appLogger.error(
        `FATAL: User ID ${req.user!.id} has no linked Employee profile.`
      );
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Profil pegawai tidak ditemukan.",
        404
      );
    }

    if (!role) {
      appLogger.error(`FATAL: User ID ${req.user!.id} has no linked Role.`);
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Role tidak ditemukan.",
        404
      );
    }

    const profile = {
      ...employee,
      role_name: role.name,
    };

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data profil berhasil didapatkan.",
      profile,
      200,
      RESPONSE_DATA_KEYS.USERS
    );
  } catch (error) {
    appLogger.error(
      `Error fetching profile for employee ${employeeCode}: ${error}`
    );

    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server saat mengambil profil.",
      500
    );
  }
};

/**
 * [PUT] /profile - Update employee profile
 */
export const updateEmployeeProfile = async (
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
    const validation = updateProfileSchema.safeParse(req.body);

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

    const employeeData = validation.data;
    const updatedProfile = await editMasterEmployeesByCode(employeeCode, {
      ...employeeData,
    });

    if (!updatedProfile) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Profil pegawai tidak ditemukan untuk diperbarui.",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data profil berhasil diperbarui.",
      updatedProfile,
      200,
      RESPONSE_DATA_KEYS.USERS
    );
  } catch (error) {
    // We use the general error handler since validation (uniqueness) is not expected here
    appLogger.error(
      `Error fetching profile for employee ${employeeCode}: ${error}`
    );

    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server saat memperbarui profil.",
      500
    );
  }
};
