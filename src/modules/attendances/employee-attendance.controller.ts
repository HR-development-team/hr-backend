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
import { processCheckIn, processCheckOut } from "./attendance.service.js";

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
      result.data
    );
  } catch (error) {
    await trx.rollback();
    console.error("Error Checking Attendance Session:", error);
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
      200
    );
  } catch (error) {
    await trx.rollback();
    console.error("Error Clock Out", error);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan server",
      500
    );
  }
};

// export const checkOut = async (req: AuthenticatedRequest, res: Response) => {
//   const employeeCode = req.user!.employee_code;

//   if (!employeeCode) {
//     return errorResponse(
//       res,
//       API_STATUS.UNAUTHORIZED,
//       "Akun ini tidak terhubung dengan data pegawai.",
//       401
//     );
//   }
//   try {
//     // validate the request first
//     const validation = checkOutSchema.safeParse(req.body);
//     if (!validation.success) {
//       return errorResponse(
//         res,
//         API_STATUS.BAD_REQUEST,
//         "Validasi gagal",
//         400,
//         validation.error.errors.map((err) => ({
//           field: err.path[0],
//           message: err.message,
//         }))
//       );
//     }

//     const profile = await getMasterEmployeesByCode(employeeCode);
//     if (!profile) {
//       appLogger.error(
//         `FATAL: User Code ${req.user!.user_code} has no linked Employee profile.`
//       );
//       return errorResponse(
//         res,
//         API_STATUS.NOT_FOUND,
//         "Profil pegawai tidak ditemukan.",
//         404
//       );
//     }

//     // check if the attendance session exist or not
//     const dateNow = formatDate();
//     const attendanceSession = await getAttendanceSessionsByDate(dateNow);
//     if (!attendanceSession) {
//       return errorResponse(
//         res,
//         API_STATUS.NOT_FOUND,
//         "Sesi absensi untuk sekarang belum ada. Coba lagi nanti",
//         404
//       );
//     }

//     // check if the session is already closed
//     if (attendanceSession.status === "closed") {
//       return errorResponse(
//         res,
//         API_STATUS.NOT_FOUND,
//         "Sesi absensi untuk hari ini sudah ditutup.",
//         403
//       );
//     }

//     // Determine check-out status (in-time, early, overtime)
//     const now = new Date();
//     const endTime = new Date(`${dateNow}T${attendanceSession.cutoff_time}`);
//     const closeTime = new Date(`${dateNow}T${attendanceSession.close_time}`);

//     let checkOutStatus: "early" | "in-time" | "overtime" | "missed" = "in-time";

//     if (now < endTime) checkOutStatus = "early";
//     else if (now > closeTime) checkOutStatus = "overtime";

//     // save the check out data to database
//     const checkOutData = await recordCheckOut({
//       employee_code: employeeCode,
//       session_code: attendanceSession.session_code,
//       check_out_time: now,
//       check_out_status: checkOutStatus,
//     });

//     if (!checkOutData) {
//       appLogger.warn(
//         `Employee ${employeeCode} attempted check-out, but no open record was found (Possible duplicate check-out).`
//       );
//       return errorResponse(
//         res,
//         API_STATUS.CONFLICT,
//         "Anda belum check-in hari ini atau sudah melakukan check-out sebelumnya.",
//         409
//       );
//     }

//     return successResponse(
//       res,
//       API_STATUS.SUCCESS,
//       `Berhasil check-out, Selamat beristirahat ${profile!.full_name}`,
//       checkOutData,
//       200,
//       RESPONSE_DATA_KEYS.ATTENDANCES
//     );
//   } catch (error) {
//     const dbError = error as unknown;
//     appLogger.error(`Error creating departments:${dbError}`);
//     return errorResponse(
//       res,
//       API_STATUS.FAILED,
//       "Terjadi kesalahan pada server",
//       500
//     );
//   }
// };

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
    appLogger.error(`Error fetching employees:${dbError}`);
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
