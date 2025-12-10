import { Request, Response } from "express";
import { errorResponse, successResponse } from "@utils/response.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@constants/general.js";
import { appLogger } from "src/common/utils/logger.js";
import { DatabaseError } from "@common/types/error.types.js";
import {
  getPermissionByRoleCodeModel,
  updateRolePermission,
} from "./permission.model.js";
import { getUsersById } from "@modules/users/user.model.js";
import { UpdatePermissionSchema } from "./permission.schemas.js";
import { AuthenticatedRequest } from "@common/middleware/jwt.js";
import { getRoleByCode } from "@modules/roles/role.model.js";

/**
 * [GET] /permissions/me - Get current logged-in user permission
 */
export const getCurrentUserPermission = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;

    // Get User Details
    const user = await getUsersById(userId);

    if (!user) {
      return errorResponse(
        res,
        API_STATUS.FAILED,
        "User tidak ditemukan.",
        404
      );
    }

    // Get Permissions for the user's role
    const permissions = await getPermissionByRoleCodeModel(user.role_code);

    // Assemble and Send Final Response
    const responseData = {
      user_code: user.user_code,
      role_name: user.role_name,
      permissions,
    };

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Permissions berhasil di dapatkan",
      responseData,
      200,
      RESPONSE_DATA_KEYS.PERMISSIONS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching features:${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /permissions/:role_code - Get permission by role code.
 */
export const getPermissionByRoleCode = async (req: Request, res: Response) => {
  try {
    const { role_code } = req.params;

    const role = await getRoleByCode(role_code);
    if (!role) {
      return errorResponse(
        res,
        API_STATUS.FAILED,
        `Role dengan code '${role_code}' tidak ditemukan.`,
        404
      );
    }

    const permissions = await getPermissionByRoleCodeModel(role_code);
    const responseData = {
      role_name: role.name,
      permissions,
    };

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      `Permissions untuk role '${role.name}' berhasil didapatkan.`,
      responseData,
      200,
      RESPONSE_DATA_KEYS.PERMISSIONS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching permissions:${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Gagal mengambil permission role karena kesalahan server.",
      500
    );
  }
};

/**
 * [PUT] /permissions/:role_code - Update permission by role code.
 */
export const updatePermissionByRoleCode = async (
  req: Request,
  res: Response
) => {
  try {
    const { role_code } = req.params;

    const role_name = await getRoleByCode(role_code);
    if (!role_name) {
      return errorResponse(
        res,
        API_STATUS.FAILED,
        `Role dengan code '${role_code}' tidak ditemukan.`,
        404
      );
    }

    // Validate request body
    const validation = UpdatePermissionSchema.safeParse(req.body);
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

    const validatedData = validation.data;
    const updatedPermissions = await updateRolePermission(
      role_code,
      validatedData
    );

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data permission berhasil diperbarui",
      updatedPermissions,
      200,
      RESPONSE_DATA_KEYS.PERMISSIONS
    );
  } catch (error) {
    const dbError = error as DatabaseError;

    if (dbError.code === "23503" || dbError.code === "ER_NO_REFERENCED_ROW_2") {
      return errorResponse(
        res,
        API_STATUS.FAILED,
        "Pembaruan gagal: Satu atau lebih Feature Code tidak terdaftar dalam sistem.",
        400
      );
    }

    // Catch-all for other server errors
    appLogger.error(`Error editing permissions:${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
