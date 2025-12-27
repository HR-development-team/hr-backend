import { NextFunction, Response } from "express";
import { errorResponse } from "@common/utils/response.js";
import { API_STATUS } from "@common/constants/general.js";
import { USER_TABLE } from "@common/constants/database.js";
import { verifyJwtSignature } from "@common/utils/jwt.js";
import { db } from "@database/connection.js";
import { JOSEError } from "jose/errors";
import { AuthenticatedRequest } from "@common/types/auth.type.js";

// Define your timeout constant (15 minutes)
const MAX_IDLE_TIME = 15 * 60 * 1000;

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // ============================================================
    // 1. DUAL TOKEN EXTRACTION STRATEGY
    // ============================================================

    let token: string | null = null;

    // STRATEGY A: Check Authorization Header (Priority for Mobile/API)
    const header = req.headers["authorization"];
    if (header && header.startsWith("Bearer ")) {
      token = header.split(" ")[1];
    }

    // STRATEGY B: Check Cookies (Priority for Web Browser)
    // If header didn't provide a token, try to read the HTTP-Only cookie
    if (!token && req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    // If both strategies fail:
    if (!token) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Akses Ditolak: Token tidak tersedia (Header atau Cookie)",
        401
      );
    }

    // ============================================================
    // 2. VERIFICATION & DB CHECKS (Existing Logic)
    // ============================================================

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

    // Check Single Session Rule
    if (user.session_token !== token) {
      // Optional: Clear cookie if session is invalid to avoid infinite loops on frontend
      res.clearCookie("accessToken");

      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Sesi kadaluarsa atau login di perangkat lain",
        401
      );
    }

    // Check Inactivity Timeout
    const lastActive = user.login_date
      ? new Date(user.login_date).getTime()
      : 0;
    const now = Date.now();

    if (now - lastActive > MAX_IDLE_TIME) {
      res.clearCookie("accessToken"); // Clear cookie on timeout

      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Sesi berakhir karena tidak ada aktivitas (Timeout)",
        401
      );
    }

    // Attach user to request
    req.user = {
      ...payload,
      id: user.id,
      email: user.email,
      role_code: user.role_code,
    };

    next();
  } catch (error) {
    const joseError = error as JOSEError;

    // Helper to clear cookie on error so browser knows to ask for login again
    const clearCookieAndReturn = (msg: string) => {
      res.clearCookie("accessToken");
      return errorResponse(res, API_STATUS.UNAUTHORIZED, msg, 401);
    };

    if (joseError.code === "ERR_JWT_EXPIRED") {
      return clearCookieAndReturn("Token kedaluwarsa");
    }

    if (
      ["ERR_JWS_INVALID", "ERR_JWS_SIGNATURE_VERIFICATION_FAILED"].includes(
        joseError.code
      )
    ) {
      return clearCookieAndReturn("Token rusak/tidak valid");
    }

    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server saat memverifikasi token",
      500
    );
  }
};
