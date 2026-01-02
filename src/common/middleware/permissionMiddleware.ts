import { ROLE_PERMISSION_TABLE } from "@common/constants/database.js";
import { API_STATUS } from "@common/constants/general.js";
import { AuthenticatedRequest } from "@common/types/auth.type.js";
import { appLogger } from "@common/utils/logger.js";
import { errorResponse } from "@common/utils/response.js";
import { db } from "@database/connection.js";
import { NextFunction, Response } from "express";

export const checkPermission = (
  featureCode: string,
  requiredAction: string
) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return errorResponse(
          res,
          API_STATUS.UNAUTHORIZED,
          "Anda belum login",
          401
        );
      }

      const userRole = req.user.role_code;

      const permission = await db(ROLE_PERMISSION_TABLE)
        .where({
          role_code: userRole,
          feature_code: featureCode,
        })
        .first();

      const actionValue = permission[requiredAction];

      const isAllowed = Boolean(actionValue);

      if (!isAllowed) {
        return errorResponse(
          res,
          API_STATUS.UNAUTHORIZED,
          `Akses Ditolak: Anda tidak memiliki izin '${requiredAction}' pada fitur ini`,
          403
        );
      }

      next();
    } catch (error) {
      appLogger.error(`Permission Check Error ${error}`);
      return errorResponse(
        res,
        API_STATUS.FAILED,
        "Server Error saat cek permission",
        500
      );
    }
  };
};
