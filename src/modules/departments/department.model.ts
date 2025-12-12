import { db } from "@database/connection.js";
import { DEPARTMENT_TABLE, OFFICE_TABLE } from "@constants/database.js";
import {
  CreateDepartment,
  Department,
  GetAllDepartment,
  UpdateDepartment,
  GetDepartmentDetail,
} from "./department.types.js";

/**
 * Function for generating department code
 */
async function generateDepartmentCode() {
  const PREFIX = "DPT";
  const PAD_LENGTH = 7;

  const lastRow = await db(DEPARTMENT_TABLE)
    .select("department_code")
    .orderBy("id", "desc")
    .first();

  if (!lastRow) {
    return PREFIX + String(1).padStart(PAD_LENGTH, "0");
  }

  const lastCode = lastRow.department_code;
  const lastNumber = parseInt(lastCode.replace(PREFIX, ""), 10);
  const newNumber = lastNumber + 1;
  return PREFIX + String(newNumber).padStart(PAD_LENGTH, "0");
}

/**
 * Get all master department.
 */
export const getAllMasterDepartments = async (
  page: number,
  limit: number
): Promise<GetAllDepartment[]> => {
  const offset = (page - 1) * limit;

  return await db(DEPARTMENT_TABLE)
    .select(
      `${DEPARTMENT_TABLE}.id`,
      `${DEPARTMENT_TABLE}.department_code`,
      `${DEPARTMENT_TABLE}.office_code`, // <--- Ambil kode kantor
      `${OFFICE_TABLE}.name as office_name`, // <--- Ambil nama kantor (Alias)
      `${DEPARTMENT_TABLE}.name`,
      `${DEPARTMENT_TABLE}.description` // <--- Ambil deskripsi
    )
    .leftJoin(
      OFFICE_TABLE,
      `${DEPARTMENT_TABLE}.office_code`,
      `${OFFICE_TABLE}.office_code`
    )
    .limit(limit)
    .offset(offset)
    .orderBy(`${DEPARTMENT_TABLE}.id`, "asc");
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

/**
 * Creates new department.
 */
export const addMasterDepartments = async (
  data: CreateDepartment
): Promise<Department> => {
  // 1. Ambil office_code dari parameter data
  const { name, description, office_code } = data;

  const department_code = await generateDepartmentCode();

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

export const getMasterOfficeByCode = async (
  officeCode: string
): Promise<any | null> => {
  return await db(OFFICE_TABLE).where("office_code", officeCode).first();
};
