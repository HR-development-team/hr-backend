import { addDays, addMinutes, isBefore, subMinutes } from "date-fns";
import {
  GetAllAttendance,
  GetEmployeeShift,
  ShiftTimes,
} from "./attendance.types.js";
import { db } from "@database/connection.js";
import { HOLIDAY_TABLE } from "@common/constants/database.js";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { TIMEZONE } from "@common/constants/general.js";

const safeDateFormat = (dateValue: string | Date | null): string => {
  if (!dateValue) {
    return "-";
  }

  let dateObj: Date;

  if (dateValue instanceof Date) {
    dateObj = dateValue;
  } else if (dateValue === "string") {
    const cleaningString = dateValue.replace(" ", "T");
    dateObj = new Date(cleaningString);
  } else {
    return "-";
  }

  if (isNaN(dateObj.getTime())) {
    return "-";
  }

  return formatInTimeZone(dateObj, TIMEZONE, "yyyy-MM-dd HH:mm:ss");
};

export const toAttendanceSimpleResponse = (
  attendance: GetAllAttendance
): GetAllAttendance => ({
  id: attendance.id,
  attendance_code: attendance.attendance_code,
  employee_code: attendance.employee_code,
  check_in_time: safeDateFormat(attendance.check_in_time),
  check_out_time: safeDateFormat(attendance.check_out_time),
  check_in_status: attendance.check_in_status,
  check_out_status: attendance.check_out_status,
  employee_name: attendance.employee_name,
  shift_code: attendance.shift_code,
  date: formatInTimeZone(attendance.date, TIMEZONE, "yyyy-MM-dd"),
  late_minutes: attendance.late_minutes,
  overtime_minutes: attendance.overtime_minutes,
});

export const calculateShiftTimes = (
  now: Date,
  shiftData: GetEmployeeShift
): ShiftTimes => {
  const todayWIBStr = formatInTimeZone(now, TIMEZONE, "yyyy-MM-dd");

  const startDateTimeStr = `${todayWIBStr} ${shiftData.start_time}:00`;
  const endDateTimeStr = `${todayWIBStr} ${shiftData.end_time}:00`;

  const shiftStartTime = fromZonedTime(startDateTimeStr, TIMEZONE);
  let shiftEndTime = fromZonedTime(endDateTimeStr, TIMEZONE);

  // const [startHours, startMinutes] = shiftData.start_time.split(":");
  // const shiftStartTime = set(now, {
  //   hours: parseInt(startHours),
  //   minutes: parseInt(startMinutes),
  //   seconds: 0,
  //   milliseconds: 0,
  // });

  // const [endHours, endMinutes] = shiftData.end_time.split(":");

  // let shiftEndTime = set(now, {
  //   hours: parseInt(endHours),
  //   minutes: parseInt(endMinutes),
  //   seconds: 0,
  //   milliseconds: 0,
  // });

  if (isBefore(shiftEndTime, shiftStartTime)) {
    shiftEndTime = addDays(shiftEndTime, 1);
  }

  const openGateTime = subMinutes(
    shiftStartTime,
    shiftData.check_in_limit_minutes || 0
  );
  const lateThresholdTime = addMinutes(
    shiftStartTime,
    shiftData.late_tolerance_minutes || 0
  );
  const closedGateTime = shiftEndTime;

  return {
    shiftStartTime,
    shiftEndTime,
    openGateTime,
    closedGateTime,
    lateThresholdTime,
  };
};

export const parseWorkDays = (workDaysRaw: any): number[] => {
  let allowedDays = workDaysRaw;
  if (typeof allowedDays === "string") {
    try {
      allowedDays = JSON.parse(allowedDays);
    } catch (error) {
      allowedDays = [];
    }
  }

  return Array.isArray(allowedDays) ? allowedDays : [];
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3;
  const toRad = (val: number) => (val * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const isHolidayForUser = async (
  todayDate: string,
  userOfficeCode: string
) => {
  const holidaysToday = await db(HOLIDAY_TABLE)
    .select("office_code", "description")
    .where("date", todayDate);

  if (holidaysToday.length === 0) return false;

  return holidaysToday.some((h) => {
    return h.office_code === null || h.office_code === userOfficeCode;
  });
};
