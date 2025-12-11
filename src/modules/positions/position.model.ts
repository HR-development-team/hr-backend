import { db } from "@database/connection.js";
import {
  POSITION_TABLE,
  EMPLOYEE_TABLE,
  OFFICE_TABLE,
  DEPARTMENT_TABLE,
  DIVISION_TABLE,
} from "@constants/database.js";
import { PositionRaw } from "./position.types.js";

/**
 * 1. Validasi apakah Kantor Ada
 */
export const getOfficeByCodeOrId = async (identifier: string) => {
  return await db(OFFICE_TABLE)
    .where("office_code", identifier)
    .orWhere("id", identifier)
    .first();
};

/**
 * 2. Ambil semua posisi + karyawan (Data Flat)
 */
export const getPositionsByOffice = async (
  officeIdentifier: string
): Promise<PositionRaw[]> => {
  return await db(POSITION_TABLE)
    .select(
      `${POSITION_TABLE}.position_code`,
      `${POSITION_TABLE}.name`,
      `${POSITION_TABLE}.parent_position_code`,
      `${EMPLOYEE_TABLE}.employee_code`,
      `${EMPLOYEE_TABLE}.full_name as employee_name`
    )
    .leftJoin(
      EMPLOYEE_TABLE,
      `${POSITION_TABLE}.position_code`,
      `${EMPLOYEE_TABLE}.position_code`
    )
    .leftJoin(
      DIVISION_TABLE,
      `${POSITION_TABLE}.division_code`,
      `${DIVISION_TABLE}.division_code`
    )
    .leftJoin(
      DEPARTMENT_TABLE,
      `${DIVISION_TABLE}.department_code`,
      `${DEPARTMENT_TABLE}.department_code`
    )
    .leftJoin(
      OFFICE_TABLE,
      `${DEPARTMENT_TABLE}.office_code`,
      `${OFFICE_TABLE}.office_code`
    )
    .where(function () {
      this.where(`${OFFICE_TABLE}.office_code`, officeIdentifier).orWhere(
        `${OFFICE_TABLE}.id`,
        officeIdentifier
      );
    })
    .orderBy(`${POSITION_TABLE}.position_code`, "asc");
};

/**
 * 3. Ambil List Jabatan (Bisa filter by Office Code)
 */
export const getAllPositions = async (officeCode?: string) => {
  const query = db(POSITION_TABLE)
    .select(
      `${POSITION_TABLE}.id`,
      `${POSITION_TABLE}.position_code`,
      `${POSITION_TABLE}.division_code`,
      `${POSITION_TABLE}.parent_position_code`,
      `${POSITION_TABLE}.name`,
      `${POSITION_TABLE}.base_salary`,
      `${POSITION_TABLE}.sort_order`,
      `${POSITION_TABLE}.description`
    )
    .orderBy(`${POSITION_TABLE}.sort_order`, "asc");

  if (officeCode) {
    query
      .leftJoin(
        DIVISION_TABLE,
        `${POSITION_TABLE}.division_code`,
        `${DIVISION_TABLE}.division_code`
      )
      .leftJoin(
        DEPARTMENT_TABLE,
        `${DIVISION_TABLE}.department_code`,
        `${DEPARTMENT_TABLE}.department_code`
      )
      .leftJoin(
        OFFICE_TABLE,
        `${DEPARTMENT_TABLE}.office_code`,
        `${OFFICE_TABLE}.office_code`
      )
      .where(`${OFFICE_TABLE}.office_code`, officeCode);
  }

  return await query;
}; // <--- KURUNG TUTUP PENTING! Function getAllPositions selesai di sini.

/**
 * 4. Ambil Detail Jabatan by ID
 * (Ditaruh DI LUAR function lain agar bisa di-export)
 */
export const getPositionById = async (id: number) => {
  return await db(`${POSITION_TABLE} as p`)
    .select(
      "p.*",
      "div.name as division_name",
      "div.department_code",
      "parent.name as parent_position_name"
    )
    .leftJoin(
      `${DIVISION_TABLE} as div`,
      "p.division_code",
      "div.division_code"
    )
    .leftJoin(
      `${POSITION_TABLE} as parent`,
      "p.parent_position_code",
      "parent.position_code"
    )
    .where("p.id", id)
    .first();
};
