import { Request, Response } from "express";
import { errorResponse, successResponse } from "@utils/response.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@constants/general.js";
import { appLogger } from "@utils/logger.js";
import { generateToken, verifyJwtSignature } from "@utils/jwt.js";
import { loginSchema } from "./auth.schema.js";
import {
  deleteUserSessionToken,
  findUserByEmail,
  updateUserLoginDate,
  updateUserSessionToken,
} from "./auth.model.js";
import { comparePassword } from "@utils/bcrypt.js";
import { AuthenticatedRequest } from "@common/types/auth.type.js";
import { getMasterEmployeesByUserCode } from "@modules/employees/employee.model.js";
import { getRoleByCode } from "@modules/roles/role.model.js";

/**
 * [POST] /api/v1/auth/login - Login User (Employee or Admin)
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    // 1. Validation check
    const validation = loginSchema.safeParse(req.body);
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

    const { email, password } = validation.data;

    // 2. Check if the user exists
    const user = await findUserByEmail(email);
    if (!user) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Email atau password salah",
        401
      );
    }

    // 3. Check session limits (15 min rule)
    if (user.session_token) {
      const MAX_IDLE_TIME = 15 * 60 * 1000; // 15 minutes
      const lastActive = new Date(user.login_date).getTime();
      const now = new Date().getTime();
      const timeDiff = now - lastActive;

      if (timeDiff < MAX_IDLE_TIME) {
        return errorResponse(
          res,
          API_STATUS.FAILED,
          "Anda sedang login di perangkat lain. Harap logout atau tunggu sesi berakhir.",
          403
        );
      }
    }

    // 4. Verify Password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Email atau password salah",
        401
      );
    }

    // 5. Get details & Generate Token
    const employee = await getMasterEmployeesByUserCode(user.user_code);
    const role = await getRoleByCode(user.role_code);

    const userResponse = {
      id: user.id,
      email: user.email,
      user_code: user.user_code,
      office_code: employee?.office_code || null,
      employee_code: employee?.employee_code || null,
      role_code: user.role_code,
      role_name: role?.name,
    };

    // Note: Your generateToken sets expiration to "1d"
    const token = await generateToken(userResponse);

    // 6. Update DB
    await updateUserSessionToken(user.user_code, token);

    // ==========================================
    // 7. SET COOKIE (NEW CODE)
    // ==========================================
    res.cookie("accessToken", token, {
      httpOnly: true, // Prevents JS access (Security against XSS)
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // Protects against CSRF
      path: "/", // Available for all routes
      maxAge: 24 * 60 * 60 * 1000, // 1 Day (Matches your JWT expiration)
    });

    // 8. Send Response
    // We still return the token in the body for the frontend to use immediately if needed
    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Login berhasil",
      {
        token,
        user: userResponse,
      },
      200,
      RESPONSE_DATA_KEYS.AUTH
    );
  } catch (error) {
    appLogger.error(`Login Error: ${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /api/v1/auth/me - Get current logged-in user info
 */
export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userPayload = req.user;

    if (!userPayload) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Token tidak mengandung data user yang valid.",
        401
      );
    }

    const userResponse = {
      id: userPayload.id,
      email: userPayload.email,
      employee_id: userPayload.employee_id,
      role: userPayload.role,
    };

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data pengguna berhasil didapatkan",
      userResponse,
      200,
      RESPONSE_DATA_KEYS.USERS
    );
  } catch (error) {
    appLogger.error(`Error getProfile: ${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [DELETE] /api/v1/auth/logout - Logout User (Employee or Admin)
 */
export const logoutUser = async (req: Request, res: Response) => {
  let token = req.cookies?.accessToken;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });

  if (token) {
    try {
      const payload = await verifyJwtSignature(token);
      if (payload && payload.user_code) {
        await deleteUserSessionToken(payload.user_code);
      }
    } catch (error) {
      console.warn("Logout with invalid/expired token - skipping DB deletion");
    }
  }

  return successResponse(
    res,
    API_STATUS.SUCCESS,
    "Logout berhasil.",
    null,
    200
  );
};

/**
 * [POST] /api/v1/auth/keep-alive
 */
export const keepSessionAlive = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { user_code } = req.user!;

    // Update the login_date to NOW()
    await updateUserLoginDate(user_code);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Session extended",
      null,
      200
    );
  } catch (error) {
    appLogger.error(`Keep Alive Error: ${error}`);
    return errorResponse(res, API_STATUS.FAILED, "Server error", 500);
  }
};
