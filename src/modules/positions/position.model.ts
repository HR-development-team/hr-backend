import { db } from "@database/connection.js";
import {
  POSITION_TABLE,
  EMPLOYEE_TABLE,
  OFFICE_TABLE,
  DEPARTMENT_TABLE,
  DIVISION_TABLE,
} from "@constants/database.js";
import {
  CreatePosition,
  GetAllPositionResponse,
  GetPositionById,
  Position,
  PositionRaw,
} from "./position.types.js";
import { officeHierarchyQuery } from "@modules/offices/office.helper.js";
import { positionSortOrder } from "./position.helper.js";

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
      `${EMPLOYEE_TABLE}.full_name as employee_name`,
      "parent_pos.name as parent_position_name"
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
    .leftJoin(
      `${POSITION_TABLE} as parent_pos`,
      `${POSITION_TABLE}.parent_position_code`,
      "parent_pos.position_code"
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
export const getAllPositions = async (
  page: number,
  limit: number,
  userOfficeCode: string | null,
  search: string,
  filterOffice: string,
  filterDept: string,
  filterDiv: string
): Promise<GetAllPositionResponse> => {
  const offset = (page - 1) * limit;

  const query = db(POSITION_TABLE)
    .leftJoin(
      `${DIVISION_TABLE}`,
      `${POSITION_TABLE}.division_code`,
      `${DIVISION_TABLE}.division_code`
    )
    .leftJoin(
      `${DEPARTMENT_TABLE}`,
      `${DIVISION_TABLE}.department_code`,
      `${DEPARTMENT_TABLE}.department_code`
    )
    .leftJoin(
      `${OFFICE_TABLE}`,
      `${DEPARTMENT_TABLE}.office_code`,
      `${OFFICE_TABLE}.office_code`
    )
    .leftJoin(
      `${POSITION_TABLE} as parent_pos`,
      `${POSITION_TABLE}.parent_position_code`,
      "parent_pos.position_code"
    );

  if (userOfficeCode) {
    const allowedOfficesSubquery =
      officeHierarchyQuery(userOfficeCode).select("office_code");

    query.whereIn(`${DEPARTMENT_TABLE}.office_code`, allowedOfficesSubquery);
  }

  if (search) {
    query.andWhere((builder) => {
      builder
        .where(`${POSITION_TABLE}.position_code`, "like", `%${search}%`)
        .orWhere(`${POSITION_TABLE}.name`, "like", `%${search}%`);
    });
  }

  if (filterOffice) {
    // We filter on the Department table's office_code column as it links to the Division
    query.andWhere(`${DEPARTMENT_TABLE}.office_code`, filterOffice);
  }

  if (filterDept) {
    // We filter on the Division table's department_code column (or Department table directly)
    query.andWhere(`${DIVISION_TABLE}.department_code`, filterDept);
  }

  if (filterDiv) {
    // Updated to use strict equality for code matching (safer than LIKE for codes)
    query.andWhere(`${POSITION_TABLE}.division_code`, filterDiv);
  }

  const countQuery = query
    .clone()
    .clearSelect()
    .count(`${POSITION_TABLE}.position_code as total`)
    .first();

  const dataQuery = query
    .select(
      `${POSITION_TABLE}.*`,
      `${OFFICE_TABLE}.name as office_name`,
      `${OFFICE_TABLE}.office_code`,
      `${DEPARTMENT_TABLE}.name as department_name`,
      `${DEPARTMENT_TABLE}.department_code`,
      `${DIVISION_TABLE}.name as division_name`,
      `${DIVISION_TABLE}.division_code`,
      "parent_pos.name as parent_position_name"
    )
    .orderBy(`${POSITION_TABLE}.sort_order`, "asc")
    .limit(limit)
    .offset(offset);

  const [totalResult, data] = await Promise.all([countQuery, dataQuery]);

  const total = totalResult ? Number(totalResult.total) : 0;
  const totalPage = Math.ceil(total / limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      total_page: totalPage,
    },
  };
};

/**
 * 4. Ambil Detail Jabatan by ID
 */
export const getPositionById = async (id: number): Promise<GetPositionById> => {
  return await db(`${POSITION_TABLE} as pos`)
    .select(
      "pos.*",
      "parent.name as parent_position_name",
      "ofc.name as office_name",
      "ofc.office_code",
      "dept.name as department_name",
      "dept.department_code",
      "div.name as division_name",
      "div.division_code"
    )
    .leftJoin(
      `${POSITION_TABLE} as parent`,
      "pos.parent_position_code",
      "parent.position_code"
    )
    // 2. Join Division
    .leftJoin(
      `${DIVISION_TABLE} as div`,
      "pos.division_code",
      "div.division_code"
    )
    // 3. Join Department
    .leftJoin(
      `${DEPARTMENT_TABLE} as dept`,
      "div.department_code",
      "dept.department_code"
    )
    // 4. Join Office
    .leftJoin(`${OFFICE_TABLE} as ofc`, "dept.office_code", "ofc.office_code")
    .where("pos.id", id)
    .first();
};

/**
 * 5. Ambil Detail Jabatan by CODE (String)
 */
export const getPositionByCode = async (code: string) => {
  return await db(`${POSITION_TABLE} as pos`)
    .select(
      "pos.*",
      "parent.name as parent_position_name",
      "ofc.name as office_name",
      "ofc.office_code",
      "dept.name as department_name",
      "dept.department_code",
      "div.name as division_name",
      "div.division_code"
    )
    .leftJoin(
      `${POSITION_TABLE} as parent`,
      "pos.parent_position_code",
      "parent.position_code"
    )
    // 2. Join Division
    .leftJoin(
      `${DIVISION_TABLE} as div`,
      "pos.division_code",
      "div.division_code"
    )
    // 3. Join Department
    .leftJoin(
      `${DEPARTMENT_TABLE} as dept`,
      "div.department_code",
      "dept.department_code"
    )
    // 4. Join Office
    .leftJoin(`${OFFICE_TABLE} as ofc`, "dept.office_code", "ofc.office_code")
    .where("pos.position_code", code)
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
export const addMasterPosition = async (
  data: CreatePosition
): Promise<Position> => {
  const {
    parent_position_code,
    division_code,
    name,
    base_salary,
    description,
  } = data;

  const position_code = await generateNextPositionCode();
  const sort_order = await positionSortOrder();

  const [id] = await db(POSITION_TABLE).insert({
    position_code,
    division_code,
    parent_position_code,
    name,
    base_salary,
    sort_order,
    description,
  });

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
