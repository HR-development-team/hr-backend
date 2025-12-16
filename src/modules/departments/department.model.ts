import { db } from "@database/connection.js";
import { DEPARTMENT_TABLE, OFFICE_TABLE } from "@constants/database.js";
import {
  CreateDepartment,
  Department,
  GetAllDepartment,
  UpdateDepartment,
  GetDepartmentDetail,
} from "./department.types.js";
import { officeHierarchyQuery } from "@modules/offices/office.helper.js";

/**
 * Function for generating department code
 */
async function generateDepartmentCode(office_code: string) {
  const PREFIX = "DPT";
  const OFFICE_PAD_LENGTH = 2;
  const SEQUENCE_PAD_LENGTH = 5;

  const officeNumberMatch = office_code.match(/\d+$/);
  const officeNumber = officeNumberMatch
    ? parseInt(officeNumberMatch[0], 10)
    : 0;

  const officePrefix = String(officeNumber).padStart(OFFICE_PAD_LENGTH, "0");

  const lastRow = await db(DEPARTMENT_TABLE)
    .where("office_code", office_code)
    .orderBy("department_code", "desc")
    .first();

  if (!lastRow) {
    return `${PREFIX}${officePrefix}${String(1).padStart(SEQUENCE_PAD_LENGTH, "0")}`;
  }

  // if (!lastRow) {
  //   return PREFIX + String(1).padStart(SEQUENCE_PAD_LENGTH, "0");
  // }

  const lastCode = lastRow.department_code;
  const lastSequenceStr = lastCode.slice(-SEQUENCE_PAD_LENGTH);
  const lastSequence = parseInt(lastSequenceStr, 10);
  // const lastNumber = parseInt(lastCode.replace(PREFIX, ""), 10);
  // const newNumber = lastNumber + 1;
  const newSequence = lastSequence + 1;
  // return PREFIX + String(newNumber).padStart(PAD_LENGTH, "0");
  return `${PREFIX}${officePrefix}${String(newSequence).padStart(SEQUENCE_PAD_LENGTH, "0")}`;
}

/**
 * Get all master department.
 */
export const getAllMasterDepartments = async (
  page: number,
  limit: number,
  userOfficeCode: string | null,
  search: string,
  searchByOfficeCode: string
): Promise<GetAllDepartment[]> => {
  const offset = (page - 1) * limit;

  const query = db(DEPARTMENT_TABLE)
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
    );

  if (userOfficeCode) {
    const allowedOfficesSubquery =
      officeHierarchyQuery(userOfficeCode).select("office_code");

    query.whereIn(`${DEPARTMENT_TABLE}.office_code`, allowedOfficesSubquery);
  }

  if (search) {
    query.andWhere((builder) => {
      builder
        .where(`${DEPARTMENT_TABLE}.department_code`, "like", `%${search}%`)
        .orWhere(`${DEPARTMENT_TABLE}.name`, "like", `%${search}%`);
    });
  }

  if (searchByOfficeCode) {
    query.andWhere((builder) => {
      builder.where(
        `${DEPARTMENT_TABLE}.office_code`,
        "like",
        `%${searchByOfficeCode}%`
      );
    });
  }

  return query
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
