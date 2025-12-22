import { NextFunction, Response } from "express";
import { errorResponse } from "@common/utils/response.js";
import { API_STATUS } from "@common/constants/general.js";
import { USER_TABLE } from "@common/constants/database.js";
import { verifyJwtSignature } from "@common/utils/jwt.js";
import { db } from "@database/connection.js";
import { JOSEError } from "jose/errors";
import { AuthenticatedRequest } from "@common/types/auth.type.js";

// Define your timeout constant (15 minutes)
const MAX_IDLE_TIME = 1 * 60 * 1000;

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers["authorization"];
    const token =
      header && header.startsWith("Bearer ") ? header.split(" ")[1] : null;

    if (!token) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Akses Ditolak: Token tidak tersedia",
        401
      );
    }

    const payload = await verifyJwtSignature(token);

    const user = await db(USER_TABLE)
      .where({ user_code: payload.user_code })
      .first();

    if (!user) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "User tidak valid",
        401
      );
    }

    // 1. Check if token matches (Single Session Rule)
    if (user.session_token !== token) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Sesi kadaluarsa atau login di perangkat lain",
        401
      );
    }

    // Check if the session is "stale" (Inactivity Timeout)
    const lastActive = user.login_date
      ? new Date(user.login_date).getTime()
      : 0;
    const now = Date.now();

    // If (Current Time - Last Active Time) > 15 minutes
    if (now - lastActive > MAX_IDLE_TIME) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Sesi berakhir karena tidak ada aktivitas (Timeout)",
        401
      );
    }

    req.user = {
      ...payload,
      id: user.id,
      email: user.email,
      role_code: user.role_code,
    };

    next();
  } catch (error) {
    const joseError = error as JOSEError;

    if (joseError.code === "ERR_JWT_EXPIRED") {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Token kedaluwarsa",
        401
      );
    }

    if (
      ["ERR_JWS_INVALID", "ERR_JWS_SIGNATURE_VERIFICATION_FAILED"].includes(
        joseError.code
      )
    ) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Token rusak/tidak valid",
        401
      );
    }

    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server saat memverifikasi token",
      500
    );
  }
};
