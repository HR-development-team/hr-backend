import {
  ATTENDANCE_TABLE,
  EMPLOYEE_TABLE,
  OFFICE_TABLE,
  SHIFT_TABLE,
} from "@constants/database.js";
import { db } from "@database/connection.js";
import { Knex } from "knex";
import {
  Attendance,
  CheckInPayload,
  CheckOutPayload,
  GetAllAttendance,
  GetAllAttendanceResponse,
  GetEmployeeShift,
} from "./attendance.types.js";
import { format } from "date-fns";
import { officeHierarchyQuery } from "@modules/offices/office.helper.js";

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
export const getAllAttendances = async (
  page: number,
  limit: number,
  userOfficeCode: string,
  filterStartDate?: string,
  filterEndDate?: string,
  filterOfficeCode?: string,
  search?: string,
  filterStatus?: string
): Promise<GetAllAttendanceResponse> => {
  const offset = (page - 1) * limit;

  const query = db(ATTENDANCE_TABLE)
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${ATTENDANCE_TABLE}.employee_code`,
      `${EMPLOYEE_TABLE}.employee_code`
    )
    .leftJoin(
      `${OFFICE_TABLE}`,
      `${EMPLOYEE_TABLE}.office_code`,
      `${OFFICE_TABLE}.office_code`
    );

  if (userOfficeCode) {
    const allowedOfficesSubquery =
      officeHierarchyQuery(userOfficeCode).select("office_code");

    query.whereIn(`${EMPLOYEE_TABLE}.office_code`, allowedOfficesSubquery);
  }

  // We filter on the Office table's office_code column as it links to the Employees
  if (filterOfficeCode) {
    query.andWhere(`${EMPLOYEE_TABLE}.office_code`, filterOfficeCode);
  }

  // We filter the date column based on the start date and end date
  if (filterStartDate && filterEndDate) {
    query.andWhereBetween(`${ATTENDANCE_TABLE}.date`, [
      filterStartDate,
      filterEndDate,
    ]);
  } else if (filterStartDate) {
    query.andWhere(`${ATTENDANCE_TABLE}.date`, filterStartDate);
  }

  //  We filter the check_in_status column based on the status
  if (filterStatus) {
    query.andWhere(`${ATTENDANCE_TABLE}.check_in_status`, filterStatus);
  }

  if (search) {
    query.andWhere((builder) => {
      builder
        .where(`${EMPLOYEE_TABLE}.full_name`, "like", `%${search}%`)
        .orWhere(`${EMPLOYEE_TABLE}.employee_code`, "like", `%${search}%`);
    });
  }

  const countQuery = query
    .clone()
    .clearSelect()
    .count(`${ATTENDANCE_TABLE}.attendance_code as total`)
    .first();

  const dataQuery = query
    .select(
      `${ATTENDANCE_TABLE}.id`,
      `${ATTENDANCE_TABLE}.attendance_code`,
      `${ATTENDANCE_TABLE}.employee_code`,
      `${ATTENDANCE_TABLE}.check_in_time`,
      `${ATTENDANCE_TABLE}.check_out_time`,
      `${ATTENDANCE_TABLE}.check_in_status`,
      `${ATTENDANCE_TABLE}.check_out_status`,
      `${ATTENDANCE_TABLE}.date`,
      `${ATTENDANCE_TABLE}.late_minutes`,
      `${ATTENDANCE_TABLE}.overtime_minutes`,
      // Employee Fields
      `${EMPLOYEE_TABLE}.full_name as employee_name`
    )
    .orderBy(`${ATTENDANCE_TABLE}.created_at`, "desc")
    .limit(limit)
    .offset(offset);

  const [totalResult, data] = await Promise.all([countQuery, dataQuery]);

  const total = totalResult ? Number(totalResult.total) : 0;
  const totalpage = Math.ceil(total / limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      total_page: totalpage,
    },
  };
};

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
