import {
  DEPARTMENT_TABLE,
  DIVISION_TABLE,
  OFFICE_TABLE,
} from "@constants/database.js";
import { db } from "@database/connection.js";
import {
  CreateDivision,
  Division,
  GetAllDivision,
  GetDivisionByCode,
  GetDivisionById,
  UpdateDivision,
} from "./division.types.js";
import { officeHierarchyQuery } from "@modules/offices/office.helper.js";
import { generateDivisionCode } from "./division.helper.js";

/**
 * Get all master division.
 */
export const getAllMasterDivision = async (
  page: number,
  limit: number,
  userOfficeCode: string | null,
  search: string,
  deptCode: string
): Promise<GetAllDivision[]> => {
  const offset = (page - 1) * limit;

  const query = db(DIVISION_TABLE)
    .select(
      `${DIVISION_TABLE}.*`,
      `${DEPARTMENT_TABLE}.name as department_name`,
      `${OFFICE_TABLE}.office_code`,
      `${OFFICE_TABLE}.name as office_name`
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
    );

  if (userOfficeCode) {
    const allowedOfficesSubquery =
      officeHierarchyQuery(userOfficeCode).select("office_code");

    query.whereIn(`${DEPARTMENT_TABLE}.office_code`, allowedOfficesSubquery);
  }

  if (search) {
    query.andWhere((builder) => {
      builder
        .where(`${DIVISION_TABLE}.division_code`, "like", `%${search}%`)
        .orWhere(`${DIVISION_TABLE}.name`, "like", `%${search}%`);
    });
  }

  if (deptCode) {
    query.andWhere((builder) => {
      builder.where(
        `${DIVISION_TABLE}.department_code`,
        "like",
        `%${deptCode}%`
      );
    });
  }

  return query
    .limit(limit)
    .offset(offset)
    .orderBy(`${DIVISION_TABLE}.id`, "asc");
};

/**
 * Get division by ID.
 */
export const getMasterDivisionsById = async (
  id: number
): Promise<GetDivisionById | null> =>
  await db(DIVISION_TABLE)
    .select(
      "master_divisions.*",
      "master_departments.name as department_name",
      "master_offices.office_code",
      "master_offices.name as office_name"
    )
    .leftJoin(
      "master_departments",
      "master_divisions.department_code",
      "master_departments.department_code"
    )
    .leftJoin(
      "master_offices",
      "master_departments.office_code",
      "master_offices.office_code"
    )
    .where({ "master_divisions.id": id })
    .first();

export const getMasterDivisionsByCode = async (
  divisionCode: string
): Promise<GetDivisionByCode | null> =>
  await db(DIVISION_TABLE)
    .select(
      "master_divisions.*",
      "master_departments.name as department_name",
      "master_offices.office_code",
      "master_offices.name as office_name"
    )
    .leftJoin(
      "master_departments",
      "master_divisions.department_code",
      "master_departments.department_code"
    )
    .leftJoin(
      "master_offices",
      "master_departments.office_code",
      "master_offices.office_code"
    )
    .where({ "master_divisions.division_code": divisionCode })
    .first();

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
