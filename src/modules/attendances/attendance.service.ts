import { Knex } from "knex";
import {
  AttendanceUIState,
  CheckInResult,
  CheckOutResult,
} from "./attendance.types.js";
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
import { differenceInMinutes, getDay, isAfter, isBefore } from "date-fns";
import { getHolidayDateAndOffice } from "@modules/holidays/holidays.model.js";
import { appLogger } from "@common/utils/logger.js";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { TIMEZONE } from "@common/constants/general.js";

export const processCheckIn = async (
  trx: Knex.Transaction,
  employeeCode: string,
  userLat: number,
  userLong: number
): Promise<CheckInResult> => {
  const now = new Date();
  const todayStr = formatInTimeZone(now, TIMEZONE, "yyyy-MM-dd");

  const nowWIB = toZonedTime(now, TIMEZONE);
  const currentDayIndex = getDay(nowWIB);

  const existingAttendance = await getAttendanceByDate(employeeCode, todayStr);

  if (existingAttendance) {
    return {
      success: false,
      statusCode: 400,
      message: "Anda sudah melakukan Check-In hari ini",
    };
  }

  const employeeData = await getEmployeeShift(employeeCode);

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
      message: `Sesi belum dibuka. Absen mulai pukul ${formatInTimeZone(openGateTime, TIMEZONE, "HH:mm")}`,
      data: [{ open_time: formatInTimeZone(openGateTime, TIMEZONE, "HH:mm") }],
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

    appLogger.info(
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
        shift_start: formatInTimeZone(shiftStartTime, TIMEZONE, "HH:mm"),
        late_threshold: formatInTimeZone(lateThresholdTime, TIMEZONE, "HH:mm"),
        check_in_deadline: formatInTimeZone(closedGateTime, TIMEZONE, "HH:mm"),
        server_time: formatInTimeZone(now, TIMEZONE, "HH:mm:ss"),
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

  const employeeData = await getEmployeeShift(employeeCode);

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

    appLogger.info(
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
      shift_end: formatInTimeZone(shiftEndTime, TIMEZONE, "HH:mm"),
      attendance_code: activeAttendance.attendance_code,
      check_out_time: formatInTimeZone(now, TIMEZONE, "HH:mm"),
      status: checkOutStatus,
      overTime_minutes: overTimeMinutes,
    },
  };
};

export const getDailyAttendanceStatusService = async (
  employeeCode: string
): Promise<AttendanceUIState> => {
  const now = new Date();
  const todayStr = formatInTimeZone(now, TIMEZONE, "yyyy-MM-dd");

  const [employeeData, existingAttendance] = await Promise.all([
    getEmployeeShift(employeeCode),
    getAttendanceByDate(employeeCode, todayStr),
  ]);

  let uiState: AttendanceUIState = {
    status_message: "Memuat data...",
    button_label: "Loading...",
    button_variant: "disabled",
    can_check_in: false,
    can_check_out: false,
    server_time: formatInTimeZone(now, TIMEZONE, "HH:mm:ss"),
    shift_detail: {
      name: "-",
      start: "-",
      end: "-",
      open_at: "-",
    },
  };

  if (!employeeData || !employeeData.start_time) {
    uiState.status_message = "Anda tidak memiliki jadwal shift hari ini.";
    uiState.button_label = "No Shift";
    return uiState;
  }

  const shiftTimes = calculateShiftTimes(now, employeeData);

  uiState.shift_detail = {
    name: employeeData.shift_name || "Regular",
    start: employeeData.start_time,
    end: employeeData.end_time,
    open_at: formatInTimeZone(shiftTimes.openGateTime, TIMEZONE, "HH:mm"),
  };

  if (existingAttendance && !existingAttendance.check_out_time) {
    uiState.can_check_in = false;
    uiState.can_check_out = true;
    uiState.button_label = "Check Out";
    uiState.button_variant = "danger"; // Merah untuk checkout
    uiState.status_message = "Selamat bekerja! Jangan lupa absen pulang.";
  }
  // B. SUDAH SELESAI (Sudah Pulang)
  else if (existingAttendance && existingAttendance.check_out_time) {
    uiState.can_check_in = false;
    uiState.can_check_out = false;
    uiState.button_label = "Selesai";
    uiState.button_variant = "success";
    uiState.status_message = "Absensi hari ini selesai. Sampai jumpa besok!";
  }
  // C. BELUM ABSEN (Cek Waktu)
  else {
    // C1. Terlalu Pagi
    if (isBefore(now, shiftTimes.openGateTime)) {
      uiState.can_check_in = false;
      uiState.button_label = "Belum Dibuka";
      uiState.button_variant = "disabled";
      uiState.status_message = `Absen dibuka pukul ${formatInTimeZone(shiftTimes.openGateTime, TIMEZONE, "HH:mm")}`;
    }
    // C2. Shift Sudah Berakhir
    else if (isAfter(now, shiftTimes.closedGateTime)) {
      uiState.can_check_in = false;
      uiState.button_label = "Shift Berakhir";
      uiState.button_variant = "disabled";
      uiState.status_message = "Jam kerja shift ini sudah berakhir.";
    }
    // C3. Waktunya Absen (Open Window)
    else {
      uiState.can_check_in = true;

      // Cek apakah terlambat?
      if (isAfter(now, shiftTimes.lateThresholdTime)) {
        uiState.button_label = "Check In (Telat)";
        uiState.button_variant = "warning";
        uiState.status_message = `Anda terlambat! Toleransi habis pukul ${formatInTimeZone(shiftTimes.lateThresholdTime, TIMEZONE, "HH:mm")}`;
      } else {
        uiState.button_label = "Check In";
        uiState.button_variant = "primary";
        uiState.status_message = "Silakan absen masuk.";
      }
    }
  }

  return uiState;
};
