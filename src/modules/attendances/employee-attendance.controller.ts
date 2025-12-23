import { Response, Request } from "express";
import { errorResponse, successResponse } from "@utils/response.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@constants/general.js";
import { appLogger } from "@utils/logger.js";
import { formatDate } from "@utils/formatDate.js";
import { DatabaseError } from "@apptypes/error.types.js";
import { checkInSchema, checkOutSchema } from "./attendance.schema.js";
import {
  getAttendanceByDate,
  getAttendanceById,
  getEmployeeAttendances,
  getEmployeeShift,
  getHolidayDate,
  recordCheckIn,
  recordCheckOut,
} from "./attendance.model.js";
import { AuthenticatedRequest } from "@common/types/auth.type.js";
import { getMasterEmployeesByCode } from "@modules/employees/employee.model.js";
import { getAttendanceSessionsByDate } from "@modules/attendance-sessions/session.model.js";
import {
  addDays,
  addMinutes,
  differenceInMinutes,
  format,
  getDay,
  isAfter,
  isBefore,
  set,
  subMinutes,
} from "date-fns";
import { db } from "@database/connection.js";

/**
 * [POST] /attendances/check-in - Record Employee Check-In
 */
export const checkIn = async (req: AuthenticatedRequest, res: Response) => {
  const trx = await db.transaction();
  try {
    const currentUser = req.user!;
    const employeeCode = currentUser.employee_code;

    if (!employeeCode) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Akun ini tidak terhubung dengan data karyawan",
        401
      );
    }

    const now = new Date();
    const todayStr = format(now, "yyyy-MM-dd");
    const currentDayIndex = getDay(now);

    const existingAttendance = await getAttendanceByDate(
      trx,
      employeeCode,
      todayStr
    );

    if (existingAttendance) {
      await trx.rollback;
      return errorResponse(
        res,
        "Error",
        "Anda sudah melakuan Check-In hari ini",
        400
      );
    }

    const employeeData = await getEmployeeShift(trx, employeeCode);

    if (!employeeData) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data shift karyawan tidak ditemukan",
        404
      );
    }

    const myOffice = employeeData.office_code;

    const isHoliday = await getHolidayDate(todayStr, myOffice);

    if (isHoliday) {
      return errorResponse(
        res,
        "closed",
        `Absensi Tutup. Libur: ${isHoliday.description}`,
        400
      );
    }

    let allowedDays = employeeData.work_days;

    if (typeof allowedDays === "string") {
      try {
        allowedDays = JSON.parse(allowedDays);
      } catch (error) {
        console.error("Error parsing work_days JSON:", error);
        allowedDays = [];
      }
    }

    if (!Array.isArray(allowedDays)) {
      allowedDays = [];
    }

    if (!Array.isArray(allowedDays) || !allowedDays.includes(currentDayIndex)) {
      return errorResponse(
        res,
        "closed",
        "Tidak ada jadwal shift pada hari ini (Off Day)",
        400
      );
    }

    const [startHours, startMinutes] = employeeData.start_time.split(":");

    const shiftStartTime = set(now, {
      hours: parseInt(startHours),
      minutes: parseInt(startMinutes),
      seconds: 0,
      milliseconds: 0,
    });

    const [endHours, endMinutes] = employeeData.end_time.split(":");

    let shiftEndTime = set(now, {
      hours: parseInt(endHours),
      minutes: parseInt(endMinutes),
      seconds: 0,
      milliseconds: 0,
    });

    if (isBefore(shiftEndTime, shiftStartTime)) {
      shiftEndTime = addDays(shiftEndTime, 24 * 60);
    }

    const openGateTime = subMinutes(
      shiftStartTime,
      employeeData.check_in_limit_minutes
    );

    const lateThresholdTime = addMinutes(
      shiftStartTime,
      employeeData.late_tolerance_minutes
    );

    const closedGateTime = shiftEndTime;

    if (isBefore(now, openGateTime)) {
      return errorResponse(
        res,
        "closed",
        `Sesi belum dibuka. Absen mulai pukul ${format(openGateTime, "HH:mm")}`,
        400,
        [
          {
            open_time: format(openGateTime, "HH:mm"),
          },
        ]
      );
    }

    if (isAfter(now, closedGateTime)) {
      return errorResponse(
        res,
        "closed",
        `Sesi check-in sudah ditutup (Shift Berakhir). Batas akhir: ${format(closedGateTime, "HH:mm")}`
      );
    }

    // Logika status (late vs on time)
    let attendanceStatus = "in-time";
    let lateMinutes = 0;
    let message = "Sesi absensi aktif, silakan clock-in";

    if (isAfter(now, lateThresholdTime)) {
      attendanceStatus = "late";
      lateMinutes = differenceInMinutes(now, shiftStartTime);
      message = `Anda terlambat ${lateMinutes} menit`;
    }

    return successResponse(res, "open", message, [
      {
        shift_start: format(shiftStartTime, "HH:mm"),
        late_threshold: format(lateThresholdTime, "HH:mm"),
        check_in_deadline: format(closedGateTime, "HH:mm"),
        server_time: format(now, "HH:mm:ss"),
        status_prediction: attendanceStatus,
        late_minutes: lateMinutes,
      },
    ]);
  } catch (error) {
    console.error("Error Checking Attendance Session:", error);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan di server",
      500
    );
  }
};

// export const checkIn = async (req: AuthenticatedRequest, res: Response) => {
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
//     const validation = checkInSchema.safeParse(req.body);
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

//     // check if the employee exist or not in database
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

//     // Compare current time with session open time
//     const now = new Date();
//     const openTime = new Date(
//       `${dateNow}T${attendanceSession.open_time}+07:00`
//     );
//     if (now < openTime) {
//       return errorResponse(
//         res,
//         API_STATUS.FAILED,
//         "Sesi absensi untuk sekarang belum ada. Coba lagi nanti",
//         403
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

//     // Determine check-in status (late or in-time)
//     const startTime = new Date(`${dateNow}T${attendanceSession.cutoff_time}`);
//     const checkInStatus = now > startTime ? "late" : "in-time";

//     // Record check-in data
//     const checkInData = await recordCheckIn({
//       employee_code: employeeCode,
//       session_code: attendanceSession.session_code,
//       check_in_time: now,
//       check_in_status: checkInStatus,
//     });

//     return successResponse(
//       res,
//       API_STATUS.SUCCESS,
//       `Berhasil check-in, Selamat bekerja ${profile!.full_name}`,
//       checkInData,
//       201,
//       RESPONSE_DATA_KEYS.ATTENDANCES
//     );
//   } catch (error) {
//     const dbError = error as DatabaseError;

//     if (dbError.code === "ER_DUP_ENTRY" || dbError.errno === 1062) {
//       appLogger.warn(`Employee ${employeeCode} attempted duplicate check-in.`);
//       return errorResponse(
//         res,
//         API_STATUS.FAILED,
//         "Anda sudah melakukan check-in hari ini. Tidak dapat check-in ganda.",
//         409
//       );
//     }

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
 * [PUT] /attendances/check-out - Record Employee Check-Out
 */
export const checkOut = async (req: AuthenticatedRequest, res: Response) => {
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
    // validate the request first
    const validation = checkOutSchema.safeParse(req.body);
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

    const profile = await getMasterEmployeesByCode(employeeCode);
    if (!profile) {
      appLogger.error(
        `FATAL: User Code ${req.user!.user_code} has no linked Employee profile.`
      );
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Profil pegawai tidak ditemukan.",
        404
      );
    }

    // check if the attendance session exist or not
    const dateNow = formatDate();
    const attendanceSession = await getAttendanceSessionsByDate(dateNow);
    if (!attendanceSession) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Sesi absensi untuk sekarang belum ada. Coba lagi nanti",
        404
      );
    }

    // check if the session is already closed
    if (attendanceSession.status === "closed") {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Sesi absensi untuk hari ini sudah ditutup.",
        403
      );
    }

    // Determine check-out status (in-time, early, overtime)
    const now = new Date();
    const endTime = new Date(`${dateNow}T${attendanceSession.cutoff_time}`);
    const closeTime = new Date(`${dateNow}T${attendanceSession.close_time}`);

    let checkOutStatus: "early" | "in-time" | "overtime" | "missed" = "in-time";

    if (now < endTime) checkOutStatus = "early";
    else if (now > closeTime) checkOutStatus = "overtime";

    // save the check out data to database
    const checkOutData = await recordCheckOut({
      employee_code: employeeCode,
      session_code: attendanceSession.session_code,
      check_out_time: now,
      check_out_status: checkOutStatus,
    });

    if (!checkOutData) {
      appLogger.warn(
        `Employee ${employeeCode} attempted check-out, but no open record was found (Possible duplicate check-out).`
      );
      return errorResponse(
        res,
        API_STATUS.CONFLICT,
        "Anda belum check-in hari ini atau sudah melakukan check-out sebelumnya.",
        409
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      `Berhasil check-out, Selamat beristirahat ${profile!.full_name}`,
      checkOutData,
      200,
      RESPONSE_DATA_KEYS.ATTENDANCES
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error creating departments:${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
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
