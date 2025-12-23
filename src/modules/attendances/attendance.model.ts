import {
  ATTENDANCE_SESSION_TABLE,
  ATTENDANCE_TABLE,
  EMPLOYEE_TABLE,
  HOLIDAY_TABLE,
  SHIFT_TABLE,
} from "@constants/database.js";
import { db } from "@database/connection.js";
import { Knex } from "knex";
import { GetAllAttendanceSession } from "@modules/attendance-sessions/session.types.js";
import {
  Attendance,
  CheckInPayload,
  CheckOutPayload,
  GetAllAttendance,
} from "./attendance.types.js";

/**
 * Function for generating attendance code
 */
async function generateAttendanceCode() {
  const PREFIX = "ABS";
  const PAD_LENGTH = 7;

  const lastRow = await db(ATTENDANCE_TABLE)
    .select("attendance_code")
    .orderBy("id", "desc")
    .first();

  if (!lastRow) {
    return PREFIX + String(1).padStart(PAD_LENGTH, "0");
  }

  const lastCode = lastRow.attendance_code;
  const lastNumber = parseInt(lastCode.replace(PREFIX, ""), 10);
  const newNumber = lastNumber + 1;
  return PREFIX + String(newNumber).padStart(PAD_LENGTH, "0");
}

/**
 * Creates a new attendance record (check-in).
 */
export const recordCheckIn = async (
  data: CheckInPayload
): Promise<Attendance> => {
  const attendance_code = await generateAttendanceCode();
  const attendanceToInsert = {
    ...data,
    attendance_code,
  };

  const [id] = await db(ATTENDANCE_TABLE).insert(attendanceToInsert);
  return db(ATTENDANCE_TABLE).where({ id }).first();
};

/**
 * Updates the existing attendance record (check-out) for the current day.
 */
export const recordCheckOut = async (
  data: CheckOutPayload
): Promise<Attendance | null> => {
  const { session_code, employee_code, check_out_time, check_out_status } =
    data;

  const updateCount = await db(ATTENDANCE_TABLE)
    .where({ employee_code, session_code })
    .whereNull("check_out_time")
    .update({ check_out_time, check_out_status, updated_at: new Date() });

  if (updateCount === 0) {
    return null;
  }

  return db(ATTENDANCE_TABLE).where({ employee_code, session_code }).first();
};

/**
 * Get all attendance.
 */
export const getAllAttendances = async (): Promise<GetAllAttendanceSession[]> =>
  await db(ATTENDANCE_TABLE)
    .select(
      `${ATTENDANCE_TABLE}.id`,
      `${ATTENDANCE_TABLE}.attendance_code`,
      `${ATTENDANCE_TABLE}.employee_code`,
      `${ATTENDANCE_TABLE}.session_code`,
      `${ATTENDANCE_TABLE}.check_in_time`,
      `${ATTENDANCE_TABLE}.check_out_time`,
      `${ATTENDANCE_TABLE}.check_in_status`,
      `${ATTENDANCE_TABLE}.check_out_status`,

      // Employee Fields
      `${EMPLOYEE_TABLE}.full_name as employee_name`,

      // Session Fields
      `${ATTENDANCE_SESSION_TABLE}.status as session_status`,
      `${ATTENDANCE_SESSION_TABLE}.date as session_date`
    )
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${ATTENDANCE_TABLE}.employee_code`,
      `${EMPLOYEE_TABLE}.employee_code`
    )
    .leftJoin(
      `${ATTENDANCE_SESSION_TABLE}`,
      `${ATTENDANCE_TABLE}.session_code`,
      `${ATTENDANCE_SESSION_TABLE}.session_code`
    );

/**
 * Get attendance by id.
 */
export const getAttendanceById = async (id: number): Promise<Attendance[]> =>
  await db(ATTENDANCE_TABLE)
    .select(
      `${ATTENDANCE_TABLE}.*`,

      // Employee Fields
      `${EMPLOYEE_TABLE}.full_name as employee_name`,

      // Session Fields
      `${ATTENDANCE_SESSION_TABLE}.status as session_status`,
      `${ATTENDANCE_SESSION_TABLE}.date as session_date`
    )
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${ATTENDANCE_TABLE}.employee_code`,
      `${EMPLOYEE_TABLE}.employee_code`
    )
    .leftJoin(
      `${ATTENDANCE_SESSION_TABLE}`,
      `${ATTENDANCE_TABLE}.session_code`,
      `${ATTENDANCE_SESSION_TABLE}.session_code`
    )
    .where({ "attendances.id": id })
    .first();

/**
 * Get attendance by date and employee code
 */
export const getAttendanceByDate = async (
  connection: Knex | Knex.Transaction,
  employeeCode: string,
  date: string
): Promise<Attendance> => {
  return connection(ATTENDANCE_TABLE)
    .where("employee_code", employeeCode)
    .andWhere("date", date)
    .first();
};

/**
 * Get all attendance that belong to an employee.
 */
export const getEmployeeAttendances = async (
  employeeCode: string
): Promise<GetAllAttendance[]> =>
  await db(ATTENDANCE_TABLE)
    .select(
      `${ATTENDANCE_TABLE}.id`,
      `${ATTENDANCE_TABLE}.attendance_code`,
      `${ATTENDANCE_TABLE}.employee_code`,
      `${ATTENDANCE_TABLE}.session_code`,
      `${ATTENDANCE_TABLE}.check_in_time`,
      `${ATTENDANCE_TABLE}.check_out_time`,
      `${ATTENDANCE_TABLE}.check_in_status`,
      `${ATTENDANCE_TABLE}.check_out_status`,

      // Employee Fields
      `${EMPLOYEE_TABLE}.full_name as employee_name`,

      // Session Fields
      `${ATTENDANCE_SESSION_TABLE}.status as session_status`,
      `${ATTENDANCE_SESSION_TABLE}.date as session_date`
    )
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${ATTENDANCE_TABLE}.employee_code`,
      `${EMPLOYEE_TABLE}.employee_code`
    )
    .leftJoin(
      `${ATTENDANCE_SESSION_TABLE}`,
      `${ATTENDANCE_TABLE}.session_code`,
      `${ATTENDANCE_SESSION_TABLE}.session_code`
    )
    .where({ "attendances.employee_code": employeeCode });

/**
 * Get total work days for an employee in a given date range.
 */
export const getTotalWorkDays = async (
  employeeId: number,
  startDate: string,
  endDate: string,
  knexInstance: Knex.Transaction
): Promise<number> => {
  const result = await knexInstance(ATTENDANCE_TABLE)
    .countDistinct("work_date as total_work_days")
    .where("employee_id", employeeId)
    .andWhereBetween("work_date", [startDate, endDate])
    .first();

  return Number(result?.total_work_days || 0);
};

export const getEmployeeShift = async (
  connection: Knex | Knex.Transaction,
  employeeCode: string
) => {
  return connection(EMPLOYEE_TABLE)
    .where("employee_code", employeeCode)
    .select(
      `${SHIFT_TABLE}.office_code`,
      `${SHIFT_TABLE}.work_days`,
      `${SHIFT_TABLE}.start_time`,
      `${SHIFT_TABLE}.end_time`,
      `${SHIFT_TABLE}.check_in_limit_minutes`,
      `${SHIFT_TABLE}.late_tolerance_minutes`
    )
    .leftJoin(
      `${SHIFT_TABLE}`,
      `${EMPLOYEE_TABLE}.shift_code`,
      `${SHIFT_TABLE}.shift_code`
    )
    .first();
};

export const getHolidayDate = async (date: string, officeCode: string) => {
  return await db(HOLIDAY_TABLE)
    .where("date", date)
    .andWhere((builder) => {
      builder.whereNull("office_code").orWhere("office_code", officeCode);
    })
    .first();
};
