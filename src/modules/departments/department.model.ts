import { db } from "@database/connection.js";
import { DEPARTMENT_TABLE, OFFICE_TABLE } from "@constants/database.js";
import {
  CreateDepartment,
  Department,
  GetAllDepartmentResponse,
  UpdateDepartment,
  GetDepartmentDetail,
  DepartmentOption,
} from "./department.types.js";
import { officeHierarchyQuery } from "@modules/offices/office.helper.js";
import { generateDepartmentCode } from "./department.helper.js";

export const getAllMasterDepartments = async (
  page: number,
  limit: number,
  userOfficeCode: string | null,
  search: string,
  filterOffice: string
): Promise<GetAllDepartmentResponse> => {
  const offset = (page - 1) * limit;

  // 1. Base Query (Joins)
  const query = db(DEPARTMENT_TABLE).leftJoin(
    OFFICE_TABLE,
    `${DEPARTMENT_TABLE}.office_code`,
    `${OFFICE_TABLE}.office_code`
  );

  // 2. Security Scope (User Hierarchy)
  if (userOfficeCode) {
    const allowedOfficesSubquery =
      officeHierarchyQuery(userOfficeCode).select("office_code");

    query.whereIn(`${DEPARTMENT_TABLE}.office_code`, allowedOfficesSubquery);
  }

  // 3. Search Logic (Name or Code)
  if (search) {
    query.andWhere((builder) => {
      builder
        .where(`${DEPARTMENT_TABLE}.department_code`, "like", `%${search}%`)
        .orWhere(`${DEPARTMENT_TABLE}.name`, "like", `%${search}%`);
    });
  }

  // 4. Filter: Office Code (Exact Match)
  if (filterOffice) {
    query.where(`${DEPARTMENT_TABLE}.office_code`, filterOffice);
  }

  // 5. Count Query
  const countQuery = query
    .clone()
    .clearSelect()
    .count(`${DEPARTMENT_TABLE}.id as total`)
    .first();

  // 6. Data Query
  const dataQuery = query
    .select(
      `${DEPARTMENT_TABLE}.id`,
      `${DEPARTMENT_TABLE}.department_code`,
      `${DEPARTMENT_TABLE}.office_code`,
      `${OFFICE_TABLE}.name as office_name`,
      `${DEPARTMENT_TABLE}.name`,
      `${DEPARTMENT_TABLE}.description`
    )
    .orderBy(`${DEPARTMENT_TABLE}.id`, "asc")
    .limit(limit)
    .offset(offset);

  // 7. Execute
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

export const getDepartmentOptions = async (
  userOfficeCode: string | null,
  search: string,
  filterOffice: string
): Promise<DepartmentOption[]> => {
  // 1. Base Query
  const query = db(DEPARTMENT_TABLE).select(
    `${DEPARTMENT_TABLE}.department_code`,
    `${DEPARTMENT_TABLE}.name`
  );

  // 2. SECURITY SCOPE: User's Hierarchy
  // Even if they request a specific office, we must ensure it's in their hierarchy.
  if (userOfficeCode) {
    const allowedOfficesSubquery =
      officeHierarchyQuery(userOfficeCode).select("office_code");

    query.whereIn(`${DEPARTMENT_TABLE}.office_code`, allowedOfficesSubquery);
  }

  // 3. FILTER: Specific Office (Optional)
  // Used when the frontend selects an Office first
  if (filterOffice) {
    query.where(`${DEPARTMENT_TABLE}.office_code`, filterOffice);
  }

  // 4. SEARCH: Autocomplete
  if (search) {
    query.andWhere((builder) => {
      builder
        .where(`${DEPARTMENT_TABLE}.department_code`, "like", `%${search}%`)
        .orWhere(`${DEPARTMENT_TABLE}.name`, "like", `%${search}%`);
    });
  }

  // 5. Order & Execute
  return query.orderBy(`${DEPARTMENT_TABLE}.name`, "asc");
};

/**
 * Get department by ID.
 */
export const getMasterDepartmentsById = async (
  id: number
): Promise<GetDepartmentDetail | null> => {
  return await db(DEPARTMENT_TABLE)
    .select(
      `${DEPARTMENT_TABLE}.id`,
      `${DEPARTMENT_TABLE}.department_code`,
      `${DEPARTMENT_TABLE}.office_code`,
      `${OFFICE_TABLE}.name as office_name`, // Ambil nama kantor
      `${DEPARTMENT_TABLE}.name`,
      `${DEPARTMENT_TABLE}.description`,
      `${DEPARTMENT_TABLE}.created_at`,
      `${DEPARTMENT_TABLE}.updated_at`
    )
    .leftJoin(
      OFFICE_TABLE,
      `${DEPARTMENT_TABLE}.office_code`,
      `${OFFICE_TABLE}.office_code`
    )
    .where(`${DEPARTMENT_TABLE}.id`, id)
    .first();
};

export const getMasterDepartmentByCode = async (
  departmentCode: string
): Promise<any | null> => {
  return await db(DEPARTMENT_TABLE)
    .select(
      `${DEPARTMENT_TABLE}.id`,
      `${DEPARTMENT_TABLE}.department_code`,
      `${DEPARTMENT_TABLE}.office_code`,
      `${OFFICE_TABLE}.name as office_name`, // Ambil nama kantor
      `${DEPARTMENT_TABLE}.name`,
      `${DEPARTMENT_TABLE}.description`,
      `${DEPARTMENT_TABLE}.created_at`,
      `${DEPARTMENT_TABLE}.updated_at`
    )
    .leftJoin(
      OFFICE_TABLE,
      `${DEPARTMENT_TABLE}.office_code`,
      `${OFFICE_TABLE}.office_code`
    )
    .where(`${DEPARTMENT_TABLE}.department_code`, departmentCode)
    .first();
};

/**
 * Creates new department.
 */
export const addMasterDepartments = async (
  data: CreateDepartment,
  officeCode: string
): Promise<Department> => {
  // 1. Ambil office_code dari parameter data
  const { name, description, office_code } = data;

  const department_code = await generateDepartmentCode(officeCode);

  const [id] = await db(DEPARTMENT_TABLE).insert({
    name,
    department_code,
    description,
    // 2. WAJIB DIMASUKKAN KE SINI
    office_code: office_code,
  });

  return db(DEPARTMENT_TABLE).where({ id }).first();
};
/**
 * edit an existing department record.
 */
/**
 * edit an existing department record.
 */
export const editMasterDepartments = async (
  data: UpdateDepartment
): Promise<Department | null> => {
  // 1. [PERBAIKAN] Ambil office_code dari parameter data
  const { id, name, description, office_code } = data;

  await db(DEPARTMENT_TABLE).where({ id }).update({
    name,
    description,
    // 2. [PERBAIKAN] Masukkan ke query update
    office_code,
    updated_at: new Date(),
  });

  return db(DEPARTMENT_TABLE).where({ id }).first();
};

/**
 * Remove existing department
 */
export async function removeMasterDepartments(id: number): Promise<number> {
  return db(DEPARTMENT_TABLE).where({ id }).delete();
}

export const getMasterOfficeByCode = async (
  officeCode: string
): Promise<any | null> => {
  return await db(OFFICE_TABLE).where("office_code", officeCode).first();
};
