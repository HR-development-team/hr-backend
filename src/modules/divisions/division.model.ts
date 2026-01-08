import {
  DEPARTMENT_TABLE,
  DIVISION_TABLE,
  EMPLOYEE_TABLE,
  OFFICE_TABLE,
  ORG_RESPONSIBILITIES_TABLE,
  POSITION_TABLE,
} from "@constants/database.js";
import { db } from "@database/connection.js";
import {
  CreateDivision,
  Division,
  DivisionOption,
  GetAllDivisionResponse,
  GetDivisionByCode,
  GetDivisionById,
  UpdateDivision,
} from "./division.types.js";
import { officeHierarchyQuery } from "@modules/offices/office.helper.js";
import {
  formatDivisionReponse,
  generateDivisionCode,
} from "./division.helper.js";

/**
 * Get all master division.
 */
export const getAllMasterDivision = async (
  page: number,
  limit: number,
  userOfficeCode: string | null,
  search: string,
  filterDept: string,
  filterOffice: string
): Promise<GetAllDivisionResponse> => {
  const offset = (page - 1) * limit;

  // 1. Base Query (Joins)
  const query = db(DIVISION_TABLE)
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
    .leftJoin(`${ORG_RESPONSIBILITIES_TABLE}`, (join) => {
      join
        .on(
          `${DIVISION_TABLE}.division_code`,
          "=",
          `${ORG_RESPONSIBILITIES_TABLE}.scope_code`
        )
        .andOnVal(`${ORG_RESPONSIBILITIES_TABLE}.scope_type`, "=", "division")
        .andOnVal(`${ORG_RESPONSIBILITIES_TABLE}.is_active`, "=", 1);
    })
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${ORG_RESPONSIBILITIES_TABLE}.employee_code`,
      `${EMPLOYEE_TABLE}.employee_code`
    )
    .leftJoin(
      `${POSITION_TABLE}`,
      `${EMPLOYEE_TABLE}.position_code`,
      `${POSITION_TABLE}.position_code`
    );

  // 2. Security Scope (User Hierarchy)
  if (userOfficeCode) {
    const allowedOfficesSubquery =
      officeHierarchyQuery(userOfficeCode).select("office_code");

    query.whereIn(`${DEPARTMENT_TABLE}.office_code`, allowedOfficesSubquery);
  }

  // 3. Search Logic
  if (search) {
    query.andWhere((builder) => {
      builder
        .where(`${DIVISION_TABLE}.division_code`, "like", `%${search}%`)
        .orWhere(`${DIVISION_TABLE}.name`, "like", `%${search}%`);
    });
  }

  // 4. Filter: Department Code (Exact Match)
  if (filterDept) {
    query.where(`${DIVISION_TABLE}.department_code`, filterDept);
  }

  // 5. Filter: Office Code (Exact Match via Department table)
  if (filterOffice) {
    query.where(`${DEPARTMENT_TABLE}.office_code`, filterOffice);
  }

  // 6. Count Query
  const countQuery = query
    .clone()
    .clearSelect()
    .count(`${DIVISION_TABLE}.id as total`)
    .first();

  // 7. Data Query
  const dataQuery = query
    .select(
      `${DIVISION_TABLE}.*`,
      `${DEPARTMENT_TABLE}.name as department_name`,
      `${OFFICE_TABLE}.office_code`,
      `${OFFICE_TABLE}.name as office_name`,

      // leader name
      `${EMPLOYEE_TABLE}.full_name as leader_name`,
      `${EMPLOYEE_TABLE}.employee_code as leader_employee_code`,

      // leader rolee
      `${ORG_RESPONSIBILITIES_TABLE}.role as leader_role`,

      // leader position
      `${POSITION_TABLE}.name as leader_position`
    )
    .orderBy(`${DIVISION_TABLE}.id`, "asc")
    .limit(limit)
    .offset(offset);

  // 8. Execute in Parallel
  const [totalResult, rawData] = await Promise.all([countQuery, dataQuery]);

  const total = totalResult ? Number(totalResult.total) : 0;
  const totalPage = Math.ceil(total / limit);

  const data = rawData.map(formatDivisionReponse);

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
 * Get division by ID.
 */
export const getMasterDivisionsById = async (
  id: number
): Promise<GetDivisionById | null> => {
  const query = await db(DIVISION_TABLE)
    .select(
      `${DIVISION_TABLE}.*`,
      `${DEPARTMENT_TABLE}.name as department_name`,
      `${OFFICE_TABLE}.office_code`,
      `${OFFICE_TABLE}.name as office_name`,

      // leader name
      `${EMPLOYEE_TABLE}.full_name as leader_name`,
      `${EMPLOYEE_TABLE}.employee_code as leader_employee_code`,

      // leader rolee
      `${ORG_RESPONSIBILITIES_TABLE}.role as leader_role`,

      // leader position
      `${POSITION_TABLE}.name as leader_position`
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
    .leftJoin(`${ORG_RESPONSIBILITIES_TABLE}`, (join) => {
      join
        .on(
          `${DIVISION_TABLE}.division_code`,
          "=",
          `${ORG_RESPONSIBILITIES_TABLE}.scope_code`
        )
        .andOnVal(`${ORG_RESPONSIBILITIES_TABLE}.scope_type`, "=", "division")
        .andOnVal(`${ORG_RESPONSIBILITIES_TABLE}.is_active`, "=", 1);
    })
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${ORG_RESPONSIBILITIES_TABLE}.employee_code`,
      `${EMPLOYEE_TABLE}.employee_code`
    )
    .leftJoin(
      `${POSITION_TABLE}`,
      `${EMPLOYEE_TABLE}.position_code`,
      `${POSITION_TABLE}.position_code`
    )
    .where(`${DIVISION_TABLE}.id`, id)
    .first();

  const data = formatDivisionReponse(query);

  return data;
};

export const getMasterDivisionsByCode = async (
  divisionCode: string | ""
): Promise<GetDivisionByCode | null> => {
  const query = await db(DIVISION_TABLE)
    .select(
      `${DIVISION_TABLE}.*`,
      `${DEPARTMENT_TABLE}.name as department_name`,
      `${OFFICE_TABLE}.office_code`,
      `${OFFICE_TABLE}.name as office_name`,

      // leader name
      `${EMPLOYEE_TABLE}.full_name as leader_name`,
      `${EMPLOYEE_TABLE}.employee_code as leader_employee_code`,

      // leader rolee
      `${ORG_RESPONSIBILITIES_TABLE}.role as leader_role`,

      // leader position
      `${POSITION_TABLE}.name as leader_position`
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
    .leftJoin(`${ORG_RESPONSIBILITIES_TABLE}`, (join) => {
      join
        .on(
          `${DIVISION_TABLE}.division_code`,
          "=",
          `${ORG_RESPONSIBILITIES_TABLE}.scope_code`
        )
        .andOnVal(`${ORG_RESPONSIBILITIES_TABLE}.scope_type`, "=", "division")
        .andOnVal(`${ORG_RESPONSIBILITIES_TABLE}.is_active`, "=", 1);
    })
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${ORG_RESPONSIBILITIES_TABLE}.employee_code`,
      `${EMPLOYEE_TABLE}.employee_code`
    )
    .leftJoin(
      `${POSITION_TABLE}`,
      `${EMPLOYEE_TABLE}.position_code`,
      `${POSITION_TABLE}.position_code`
    )
    .where(`${DIVISION_TABLE}.division_code`, divisionCode)
    .first();

  const data = formatDivisionReponse(query);

  return data;
};

export const getDivisionOptions = async (
  userOfficeCode: string | null,
  search: string,
  filterDept: string,
  filterOffice: string
): Promise<DivisionOption[]> => {
  // 1. Base Query (Must join Department to see Office info)
  const query = db(DIVISION_TABLE)
    .leftJoin(
      `${DEPARTMENT_TABLE}`,
      `${DIVISION_TABLE}.department_code`,
      `${DEPARTMENT_TABLE}.department_code`
    )
    .select(`${DIVISION_TABLE}.division_code`, `${DIVISION_TABLE}.name`);

  // 2. SECURITY SCOPE: User's Hierarchy
  // Ensure the division belongs to an office the user is allowed to see.
  if (userOfficeCode) {
    const allowedOfficesSubquery =
      officeHierarchyQuery(userOfficeCode).select("office_code");

    query.whereIn(`${DEPARTMENT_TABLE}.office_code`, allowedOfficesSubquery);
  }

  // 3. FILTER: Office (Cascading Level 1)
  if (filterOffice) {
    query.where(`${DEPARTMENT_TABLE}.office_code`, filterOffice);
  }

  // 4. FILTER: Department (Cascading Level 2)
  if (filterDept) {
    query.where(`${DIVISION_TABLE}.department_code`, filterDept);
  }

  // 5. SEARCH: Autocomplete
  if (search) {
    query.andWhere((builder) => {
      builder
        .where(`${DIVISION_TABLE}.division_code`, "like", `%${search}%`)
        .orWhere(`${DIVISION_TABLE}.name`, "like", `%${search}%`);
    });
  }

  // 6. Order & Execute
  return query.orderBy(`${DIVISION_TABLE}.name`, "asc");
};

/**
 * Creates new division.
 */
export const addMasterDivisions = async (
  data: CreateDivision
): Promise<Division> => {
  const { name, department_code, description } = data;

  const officeCode = await db(DEPARTMENT_TABLE)
    .select(`${DEPARTMENT_TABLE}.office_code`)
    .where("department_code", department_code)
    .first();

  const division_code = await generateDivisionCode(
    officeCode.office_code,
    department_code
  );

  const [id] = await db(DIVISION_TABLE).insert({
    name,
    department_code,
    division_code,
    description,
  });

  return db(DIVISION_TABLE).where({ id }).first();
};

/**
 * edit an existing division record.
 */
export const editMasterDivisions = async (
  data: UpdateDivision
): Promise<Division | null> => {
  const { id, name, department_code, description } = data;

  await db(DIVISION_TABLE)
    .where({ id })
    .update({ name, department_code, description, updated_at: new Date() });
  return db(DIVISION_TABLE).where({ id }).first();
};

/**
 * Remove existing division
 */
export async function removeMasterDivision(id: number): Promise<number> {
  return db(DIVISION_TABLE).where({ id }).delete();
}
