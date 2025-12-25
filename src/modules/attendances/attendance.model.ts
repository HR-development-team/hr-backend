import {
  ATTENDANCE_TABLE,
  EMPLOYEE_TABLE,
  OFFICE_TABLE,
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
  GetEmployeeShift,
} from "./attendance.types.js";
import { format } from "date-fns";

/**
 * Function for generating attendance code
 */
const generateAttendanceCode = async (
  employeeCode: string
): Promise<string> => {
  const now = new Date();
  const dateCode = format(now, "yyyyMMdd");
  const newAttendanceCode = `ATT-${dateCode}-${employeeCode}`;

  return newAttendanceCode;
};

/**
 * Creates a new attendance record (check-in).
 */
export const recordCheckIn = async (
  connection: Knex.Transaction,
  data: CheckInPayload
): Promise<Attendance> => {
  const attendance_code = await generateAttendanceCode(data.employee_code);
  const attendanceToInsert = {
    ...data,
    attendance_code,
  };

  const [id] = await connection(ATTENDANCE_TABLE).insert(attendanceToInsert);
  return db(ATTENDANCE_TABLE).where({ id }).first();
};

/**
 * Updates the existing attendance record (check-out) for the current day.
 */
export const recordCheckOut = async (
  connection: Knex.Transaction,
  id: number,
  data: CheckOutPayload
): Promise<Attendance | null> => {
  await connection(ATTENDANCE_TABLE)
    .where(`${ATTENDANCE_TABLE}.id`, id)
    .update({ ...data });

  return db(ATTENDANCE_TABLE).where(`${ATTENDANCE_TABLE}.id`, id).first();
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
      `${ATTENDANCE_TABLE}.check_in_time`,
      `${ATTENDANCE_TABLE}.check_out_time`,
      `${ATTENDANCE_TABLE}.check_in_status`,
      `${ATTENDANCE_TABLE}.check_out_status`,

      // Employee Fields
      `${EMPLOYEE_TABLE}.full_name as employee_name`
    )
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${ATTENDANCE_TABLE}.employee_code`,
      `${EMPLOYEE_TABLE}.employee_code`
    )
    .orderBy("attendance_code", "asc");

/**
 * Get attendance by id.
 */
export const getAttendanceById = async (id: number): Promise<Attendance[]> =>
  await db(ATTENDANCE_TABLE)
    .select(
      `${ATTENDANCE_TABLE}.*`,

      // Employee Fields
      `${EMPLOYEE_TABLE}.full_name as employee_name`
    )
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${ATTENDANCE_TABLE}.employee_code`,
      `${EMPLOYEE_TABLE}.employee_code`
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
      `${ATTENDANCE_TABLE}.check_in_time`,
      `${ATTENDANCE_TABLE}.check_out_time`,
      `${ATTENDANCE_TABLE}.check_in_status`,
      `${ATTENDANCE_TABLE}.check_out_status`,

      // Employee Fields
      `${EMPLOYEE_TABLE}.full_name as employee_name`
    )
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${ATTENDANCE_TABLE}.employee_code`,
      `${EMPLOYEE_TABLE}.employee_code`
    )
    .where({ "attendances.employee_code": employeeCode });

export const getActiveAttendanceSession = async (
  connection: Knex.Transaction,
  employeeCode: string
): Promise<Attendance> => {
  return await connection(ATTENDANCE_TABLE)
    .where("employee_code", employeeCode)
    .whereNull("check_out_time")
    .orderBy("created_at", "desc")
    .first();
};

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
  connection: Knex.Transaction,
  empOrShiftCode: string
): Promise<GetEmployeeShift> => {
  return connection(EMPLOYEE_TABLE)
    .where("employee_code", empOrShiftCode)
    .orWhere(`${SHIFT_TABLE}.shift_code`, empOrShiftCode)
    .select(
      `${SHIFT_TABLE}.office_code`,
      `${SHIFT_TABLE}.shift_code`,
      `${SHIFT_TABLE}.work_days`,
      `${SHIFT_TABLE}.start_time`,
      `${SHIFT_TABLE}.end_time`,
      `${SHIFT_TABLE}.check_in_limit_minutes`,
      `${SHIFT_TABLE}.late_tolerance_minutes`,

      // office table
      `${OFFICE_TABLE}.latitude as office_lat`,
      `${OFFICE_TABLE}.longitude as office_long`,
      `${OFFICE_TABLE}.radius_meters`
    )
    .leftJoin(
      `${SHIFT_TABLE}`,
      `${EMPLOYEE_TABLE}.shift_code`,
      `${SHIFT_TABLE}.shift_code`
    )
    .leftJoin(
      `${OFFICE_TABLE}`,
      `${EMPLOYEE_TABLE}.office_code`,
      `${OFFICE_TABLE}.office_code`
    )
    .first();
};
