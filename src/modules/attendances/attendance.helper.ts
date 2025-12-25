import { addDays, addMinutes, isBefore, set, subMinutes } from "date-fns";
import { GetEmployeeShift, ShiftTimes } from "./attendance.types.js";

export const calculateShiftTimes = (
  now: Date,
  shiftData: GetEmployeeShift
): ShiftTimes => {
  const [startHours, startMinutes] = shiftData.start_time.split(":");
  const shiftStartTime = set(now, {
    hours: parseInt(startHours),
    minutes: parseInt(startMinutes),
    seconds: 0,
    milliseconds: 0,
  });

  const [endHours, endMinutes] = shiftData.end_time.split(":");

  let shiftEndTime = set(now, {
    hours: parseInt(endHours),
    minutes: parseInt(endMinutes),
    seconds: 0,
    milliseconds: 0,
  });

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
