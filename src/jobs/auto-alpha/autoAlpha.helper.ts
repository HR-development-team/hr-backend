import { addDays, isAfter, parse } from "date-fns";

/**
 * Cek apakah user libur berdasarkan list holiday hari ini
 */
export const checkIsHoliday = (
  holidays: any[],
  userOfficeCode: string
): boolean => {
  if (holidays.length === 0) return false;

  // Return true jika ada libur Nasional (null) ATAU libur kantor user
  return holidays.some(
    (h) => h.office_code === null || h.office_code === userOfficeCode
  );
};

/**
 * Cek apakah hari ini (index 0-6) termasuk jadwal kerja shift
 */
export const checkIsWorkDay = (
  workDaysDb: any,
  todayIndex: number
): boolean => {
  let days: number[] = [];

  // Handle parsing karena DB mungkin mengembalikan JSON string atau Object
  if (Array.isArray(workDaysDb)) {
    days = workDaysDb;
  } else if (typeof workDaysDb === "string") {
    try {
      days = JSON.parse(workDaysDb);
    } catch {
      days = [];
    }
  }

  return Array.isArray(days) && days.includes(todayIndex);
};

/**
 * Cek apakah waktu sekarang sudah melewati batas jam pulang shift?
 */
export const shouldMarkAlpha = (
  now: Date,
  todayDateStr: string,
  startTime: string,
  endTime: string
): boolean => {
  if (!startTime || !endTime) return false;

  const shiftStart = parse(
    `${todayDateStr} ${startTime}`,
    "yyyy-MM-dd HH:mm:ss",
    new Date()
  );
  let shiftEnd = parse(
    `${todayDateStr} ${endTime}`,
    "yyyy-MM-dd HH:mm:ss",
    new Date()
  );

  // Handle shift overnight (Lembur lintas hari, misal masuk jam 22:00 pulang 06:00)
  if (shiftStart > shiftEnd) {
    shiftEnd = addDays(shiftEnd, 1);
  }

  // Tandai alpha HANYA JIKA waktu sekarang > waktu pulang
  return isAfter(now, shiftEnd);
};
