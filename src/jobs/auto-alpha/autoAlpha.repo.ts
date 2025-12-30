import {
  ATTENDANCE_TABLE,
  EMPLOYEE_TABLE,
  HOLIDAY_TABLE,
  SHIFT_TABLE,
} from "@common/constants/database.js";
import { format } from "date-fns";
import { Knex } from "knex";

/**
 * Bulk auto alpha for cron job
 */
export const bulkCreateAttendance = async (
  connection: Knex.Transaction,
  data: any
  // data: Partial<Attendance>[]
) => {
  if (data.length === 0) return;

  await connection(ATTENDANCE_TABLE).insert(data);
};

export const fetchAutoAlphaData = async (trx: Knex.Transaction) => {
  const now = new Date();
  const todayDate = format(now, "yyyy-MM-dd");

  // 1. Ambil Karyawan Aktif + Shift (Pararel)
  const activeEmployeesQuery = trx(EMPLOYEE_TABLE)
    .select(
      `${EMPLOYEE_TABLE}.id`,
      `${EMPLOYEE_TABLE}.employee_code`,
      `${EMPLOYEE_TABLE}.shift_code`,
      `${EMPLOYEE_TABLE}.office_code`,
      `${EMPLOYEE_TABLE}.full_name`,
      `${SHIFT_TABLE}.start_time`,
      `${SHIFT_TABLE}.end_time`,
      `${SHIFT_TABLE}.work_days`
    )
    .whereNull("resign_date")
    .whereNotNull(`${EMPLOYEE_TABLE}.shift_code`)
    .leftJoin(
      SHIFT_TABLE,
      `${EMPLOYEE_TABLE}.shift_code`,
      `${SHIFT_TABLE}.shift_code`
    );

  // 2. Ambil Absensi Hari Ini (Pararel)
  const todayAttendanceQuery = trx(ATTENDANCE_TABLE)
    .select("employee_code")
    .where("date", todayDate);

  // 3. Ambil Hari Libur Hari Ini (Pararel)
  const todayHolidaysQuery = trx(HOLIDAY_TABLE)
    .select("office_code", "description")
    .where("date", todayDate);

  // Eksekusi semua query secara bersamaan agar cepat
  const [employees, attendances, holidays] = await Promise.all([
    activeEmployeesQuery,
    todayAttendanceQuery,
    todayHolidaysQuery,
  ]);

  return {
    employees,
    presentEmployeeCodes: new Set(attendances.map((a) => a.employee_code)),
    todayHolidays: holidays,
  };
};
