import { Knex } from "knex";
import { CheckInResult, CheckOutResult } from "./attendance.types.js";
import {
  getActiveAttendanceSession,
  getAttendanceByDate,
  getEmployeeShift,
  recordCheckIn,
  recordCheckOut,
} from "./attendance.model.js";
import {
  calculateDistance,
  calculateShiftTimes,
  parseWorkDays,
} from "./attendance.helper.js";
import {
  differenceInMinutes,
  format,
  getDay,
  isAfter,
  isBefore,
} from "date-fns";
import { getHolidayDateAndOffice } from "@modules/holidays/holidays.model.js";

export const processCheckIn = async (
  trx: Knex.Transaction,
  employeeCode: string,
  userLat: number,
  userLong: number
): Promise<CheckInResult> => {
  const now = new Date();
  const todayStr = format(now, "yyyy-MM-dd");
  const currentDayIndex = getDay(now);

  const existingAttendance = await getAttendanceByDate(
    trx,
    employeeCode,
    todayStr
  );

  if (existingAttendance) {
    return {
      success: false,
      statusCode: 400,
      message: "Anda sudah melakukan Check-In hari ini",
    };
  }

  const employeeData = await getEmployeeShift(trx, employeeCode);

  if (!employeeData || !employeeData.shift_code) {
    return {
      success: false,
      statusCode: 404,
      message: "Data shift karyawan tidak ditemukan",
    };
  }

  const isHoliday = await getHolidayDateAndOffice(
    todayStr,
    employeeData.office_code
  );

  if (isHoliday) {
    return {
      success: false,
      statusCode: 400,
      message: `Absensi Tutup. Libur ${isHoliday.description}`,
    };
  }

  const allowedDays = parseWorkDays(employeeData.work_days);
  if (!allowedDays.includes(currentDayIndex)) {
    return {
      success: false,
      statusCode: 400,
      message: "Tidak ada jadwal shift pada hari ini (Off Day)",
    };
  }

  const times = calculateShiftTimes(now, employeeData);
  const { shiftStartTime, openGateTime, closedGateTime, lateThresholdTime } =
    times;

  if (isBefore(now, openGateTime)) {
    return {
      success: false,
      statusCode: 400,
      message: `Sesi belum dibuka. Absen mulai pukul ${format(openGateTime, "HH:mm")}`,
      data: [{ open_time: format(openGateTime, "HH:mm") }],
    };
  }

  if (isAfter(now, closedGateTime)) {
    return {
      success: false,
      statusCode: 400,
      message: "Sesi check-in sudah ditutup (Shift Berakhir)",
    };
  }

  let attendanceStatus: "in-time" | "late" = "in-time";
  let lateMinutes = 0;
  let message = "Sesi absensi aktif. silahkan clock-in";

  if (isAfter(now, lateThresholdTime)) {
    attendanceStatus = "late";
    lateMinutes = differenceInMinutes(now, shiftStartTime);
    message = `Anda terlambat ${lateMinutes} menit`;
  }

  if (employeeData.office_lat && employeeData.office_long) {
    const officeLat = employeeData.office_lat;
    const officeLong = employeeData.office_long;

    const distanceMeters = calculateDistance(
      userLat,
      userLong,
      officeLat,
      officeLong
    );

    const MAX_RADIUS = employeeData.radius_meters || 100;

    console.log(
      `[GEO] User Dist: ${distanceMeters.toFixed(2)}m | Max: ${MAX_RADIUS}m`
    );

    if (distanceMeters > MAX_RADIUS) {
      return {
        success: false,
        statusCode: 400,
        message: `Lokasi kejauhan! Jarak Anda: ${distanceMeters.toFixed(0)}m. Maksimal: ${MAX_RADIUS}m.`,
      };
    }
  }

  await recordCheckIn(trx, {
    employee_code: employeeCode,
    shift_code: employeeData.shift_code,
    date: todayStr,
    check_in_time: now,
    check_in_status: attendanceStatus,
    late_minutes: lateMinutes,
    overtime_minutes: 0,
  });

  return {
    success: true,
    statusCode: 200,
    message: message,
    data: [
      {
        shift_start: format(shiftStartTime, "HH:mm"),
        late_threshold: format(lateThresholdTime, "HH:mm"),
        check_in_deadline: format(closedGateTime, "HH:mm"),
        server_time: format(now, "HH:mm:ss"),
        status_prediction: attendanceStatus,
        late_minutes: lateMinutes,
      },
    ],
  };
};

export const processCheckOut = async (
  trx: Knex.Transaction,
  employeeCode: string,
  userLat: number,
  userLong: number
): Promise<CheckOutResult> => {
  const now = new Date();
  const activeAttendance = await getActiveAttendanceSession(trx, employeeCode);

  if (!activeAttendance) {
    return {
      success: false,
      statusCode: 400,
      message: "Anda belum melakukan Check-In atau sudah Check-Out sebelumnya",
    };
  }

  const employeeData = await getEmployeeShift(trx, employeeCode);

  if (!employeeData || !employeeData.shift_code) {
    return {
      success: false,
      statusCode: 404,
      message: "Data shift karyawan tidak ditemukan",
    };
  }

  if (employeeData.office_lat && employeeData.office_long) {
    const officeLat = employeeData.office_lat;
    const officeLong = employeeData.office_long;

    const distanceMeters = calculateDistance(
      userLat,
      userLong,
      officeLat,
      officeLong
    );

    const MAX_RADIUS = employeeData.radius_meters || 100;

    console.log(
      `[GEO] User Dist: ${distanceMeters.toFixed(2)}m | Max: ${MAX_RADIUS}m`
    );

    if (distanceMeters > MAX_RADIUS) {
      return {
        success: false,
        statusCode: 400,
        message: `Gagal Check-Out! Anda berada di luar kantor (${distanceMeters.toFixed(0)}m). Harap lakukan check-out di area kantor.`,
      };
    }
  }

  const attendanceDate = new Date(activeAttendance.date);

  const { shiftEndTime } = calculateShiftTimes(attendanceDate, employeeData);

  let checkOutStatus: "early" | "overtime" | "in-time" = "in-time";
  let overTimeMinutes = 0;

  if (isBefore(now, shiftEndTime)) {
    checkOutStatus = "early";
  } else if (isAfter(now, shiftEndTime)) {
    ((checkOutStatus = "overtime"),
      (overTimeMinutes = differenceInMinutes(now, shiftEndTime)));
  }

  const updateData = {
    check_out_time: now,
    check_out_status: checkOutStatus,
    overtime_minutes: overTimeMinutes,
    updated_at: now,
  };

  await recordCheckOut(trx, activeAttendance.id, updateData);

  return {
    success: true,
    statusCode: 200,
    message: "Berhasil Check-Out",
    data: {
      shift_end: format(shiftEndTime, "HH:mm"),
      attendance_code: activeAttendance.attendance_code,
      check_out_time: format(now, "HH:mm"),
      status: checkOutStatus,
      overTime_minutes: overTimeMinutes,
    },
  };
};
