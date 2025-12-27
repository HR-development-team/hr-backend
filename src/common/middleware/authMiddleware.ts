import { NextFunction, Response } from "express";
import { errorResponse } from "@common/utils/response.js";
import { API_STATUS } from "@common/constants/general.js";
import { USER_TABLE } from "@common/constants/database.js";
import { verifyJwtSignature } from "@common/utils/jwt.js";
import { db } from "@database/connection.js";
import { JOSEError } from "jose/errors";
import { AuthenticatedRequest } from "@common/types/auth.type.js";

// Session Timeout: 15 Minutes
const MAX_IDLE_TIME = 15 * 60 * 1000;

// Debounce Update: 1 Minute
// We only update the DB if the last update was more than 1 minute ago.
// This prevents spamming UPDATE queries on every single request.
const UPDATE_THRESHOLD = 60 * 1000;

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // ============================================================
    // 1. DUAL TOKEN EXTRACTION (Header vs Cookie)
    // ============================================================
    let token: string | null = null;

    // Strategy A: Authorization Header (Priority for Mobile/API/Postman)
    const header = req.headers["authorization"];
    if (header && header.startsWith("Bearer ")) {
      token = header.split(" ")[1];
    }

    // Strategy B: Cookies (Priority for Web Browser)
    if (!token && req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Akses Ditolak: Token tidak tersedia",
        401
      );
    }

    // ============================================================
    // 2. VERIFY TOKEN & USER
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

    // 3. SINGLE SESSION CHECK (Prevent multiple logins)
    if (user.session_token !== token) {
      res.clearCookie("accessToken"); // Clear invalid cookie
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Sesi kadaluarsa atau login di perangkat lain",
        401
      );
    }

    // ============================================================
    // 4. CHECK TIMEOUT & UPDATE SESSION (Sliding Window)
    // ============================================================

    // Convert DB date to milliseconds
    const lastActive = user.login_date
      ? new Date(user.login_date).getTime()
      : 0;
    const now = Date.now();

    // A. Check if user has been idle too long
    if (now - lastActive > MAX_IDLE_TIME) {
      res.clearCookie("accessToken");
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Sesi berakhir karena tidak ada aktivitas (Timeout)",
        401
      );
    }

    // B. "Touch" the session (Refresh the timer)
    // We only update the DB if > 1 minute has passed since the last update
    // to improve performance.
    if (now - lastActive > UPDATE_THRESHOLD) {
      await db(USER_TABLE).where({ user_code: user.user_code }).update({
        login_date: new Date(), // Sets to CURRENT_TIMESTAMP
      });
    }

    // ============================================================
    // 5. ATTACH USER TO REQUEST
    // ============================================================
    req.user = {
      ...payload,
      id: user.id,
      email: user.email,
      role_code: user.role_code,
    };

    next();
  } catch (error) {
    const joseError = error as JOSEError;

    // Helper to clear cookie and return error
    const rejectAuth = (message: string) => {
      res.clearCookie("accessToken");
      return errorResponse(res, API_STATUS.UNAUTHORIZED, message, 401);
    };

    if (joseError.code === "ERR_JWT_EXPIRED") {
      return rejectAuth("Token kedaluwarsa");
    }

    if (
      ["ERR_JWS_INVALID", "ERR_JWS_SIGNATURE_VERIFICATION_FAILED"].includes(
        joseError.code
      )
    ) {
      return rejectAuth("Token rusak atau tidak valid");
    }

    // Generic error
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server saat memverifikasi token",
      500
    );
  }
};
