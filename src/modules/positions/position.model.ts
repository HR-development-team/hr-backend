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
 * 2. Ambil semua posisi + karyawan (Data Flat untuk Tree)
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
    .orderBy(`${POSITION_TABLE}.sort_order`, "asc");
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
};

/**
 * 4. Ambil Detail Jabatan by ID
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

/**
 * 5. Ambil Detail Jabatan by CODE (String)
 */
export const getPositionByCode = async (code: string) => {
  return await db(`${POSITION_TABLE} as p`)
    .select(
      "p.*",
      "div.name as division_name",
      "dept.department_code",
      "dept.name as department_name",
      "parent.name as parent_position_name"
    )
    .leftJoin(
      `${DIVISION_TABLE} as div`,
      "p.division_code",
      "div.division_code"
    )
    .leftJoin(
      `${DEPARTMENT_TABLE} as dept`,
      "div.department_code",
      "dept.department_code"
    )
    .leftJoin(
      `${POSITION_TABLE} as parent`,
      "p.parent_position_code",
      "parent.position_code"
    )
    .where("p.position_code", code)
    .first();
};

// --- FUNGSI UNTUK CREATE & UPDATE ---

/**
 * 6. Cek apakah Division Code ada
 */
export const checkDivisionExists = async (divisionCode: string) => {
  const result = await db(DIVISION_TABLE)
    .where("division_code", divisionCode)
    .first();
  return !!result;
};

/**
 * 7. Cek apakah Position Code ada
 */
export const checkPositionExists = async (positionCode: string) => {
  const result = await db(POSITION_TABLE)
    .where("position_code", positionCode)
    .first();
  return !!result;
};

/**
 * 8. Generate Next Position Code
 */
export const generateNextPositionCode = async () => {
  const lastRecord = await db(POSITION_TABLE)
    .orderBy("position_code", "desc")
    .first();

  if (!lastRecord) {
    return "JBT0000001";
  }

  const lastCode = lastRecord.position_code;
  const lastNumber = parseInt(lastCode.replace("JBT", ""), 10);
  const nextNumber = lastNumber + 1;

  return `JBT${nextNumber.toString().padStart(7, "0")}`;
};

/**
 * 9. Insert Position Baru
 */
export const createPosition = async (data: {
  position_code: string;
  division_code: string;
  parent_position_code: string | null;
  name: string;
  base_salary: number;
  sort_order: number;
  description?: string;
}) => {
  const [id] = await db(POSITION_TABLE).insert(data);
  return await db(POSITION_TABLE).where("id", id).first();
};

/**
 * 10. Update Position
 * <-- INI YANG TADI ERROR (HILANG) -->
 */
export const updatePosition = async (id: number, data: any) => {
  const dataToUpdate = {
    ...data,
    updated_at: db.fn.now(),
  };

  await db(POSITION_TABLE).where("id", id).update(dataToUpdate);

  return await getPositionById(id);
};

/**
 * 11. Hitung karyawan yang menempati posisi
 */
export const countEmployeesByPositionCode = async (positionCode: string) => {
  const result = await db(EMPLOYEE_TABLE)
    .where("position_code", positionCode)
    .count<{ count: number }[]>({ count: "*" });
  return Number(result[0]?.count ?? 0);
};

/**
 * 12. Hitung posisi bawahan (child)
 */
export const countChildPositionsByCode = async (positionCode: string) => {
  const result = await db(POSITION_TABLE)
    .where("parent_position_code", positionCode)
    .count<{ count: number }[]>({ count: "*" });
  return Number(result[0]?.count ?? 0);
};

/**
 * 13. Delete posisi by ID
 */
export const deletePositionById = async (id: number) => {
  return await db(POSITION_TABLE).where("id", id).del();
};
