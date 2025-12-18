// status.model.ts
import { db } from "@database/connection.js";
import { EMPLOYMENT_STATUS_TABLE } from "@constants/database.js";
import {
  CreateEmploymentStatus,
  GetAllEmploymentStatus,
  GetEmploymentStatusById,
  GetEmploymentStatusByCode,
  UpdateEmploymentStatus,
  EmploymentStatus,
} from "./status.types.js";

/**
 * Function for generating status code with prefix EPS
 * Format: EPS0000001, EPS0000002, EPS0000003, dst
 */
async function generateStatusCode(): Promise<string> {
  const PREFIX = "EPS";
  const PAD_LENGTH = 7;

  const lastRow = await db(EMPLOYMENT_STATUS_TABLE)
    .select("status_code")
    .where("status_code", "like", `${PREFIX}%`)
    .orderBy("id", "desc")
    .first();

  if (!lastRow) {
    return PREFIX + String(1).padStart(PAD_LENGTH, "0");
  }

  const lastCode = lastRow.status_code;
  const lastNumber = parseInt(lastCode.replace(PREFIX, ""), 10);
  const newNumber = lastNumber + 1;
  return PREFIX + String(newNumber).padStart(PAD_LENGTH, "0");
}

/**
 * Get all employment statuses.
 */
export const getAllEmploymentStatuses = async (
  page: number,
  limit: number
): Promise<GetAllEmploymentStatus[]> => {
  const offset = (page - 1) * limit;

  return await db(EMPLOYMENT_STATUS_TABLE)
    .select("id", "status_code", "name", "description")
    .limit(limit)
    .offset(offset)
    .orderBy("created_at", "desc");
};

/**
 * Get employment status by ID.
 */
export const getEmploymentStatusById = async (
  id: number
): Promise<GetEmploymentStatusById | null> =>
  await db(EMPLOYMENT_STATUS_TABLE).where({ id }).first();

/**
 * Get employment status by status_code.
 */
export const getEmploymentStatusByCode = async (
  status_code: string
): Promise<GetEmploymentStatusByCode | null> =>
  await db(EMPLOYMENT_STATUS_TABLE).where({ status_code }).first();

/**
 * Creates new employment status.
 */
export const addEmploymentStatus = async (
  data: CreateEmploymentStatus
): Promise<EmploymentStatus> => {
  // Generate status_code otomatis: EPS0000001
  const status_code = await generateStatusCode();

  const statusToInsert = {
    ...data,
    status_code,
  };

  const [id] = await db(EMPLOYMENT_STATUS_TABLE).insert(statusToInsert);
  return db(EMPLOYMENT_STATUS_TABLE).where({ id }).first();
};

/**
 * Edit an existing employment status record.
 */
export const editEmploymentStatus = async (
  data: UpdateEmploymentStatus
): Promise<EmploymentStatus | null> => {
  const { id, ...updateData } = data;

  await db(EMPLOYMENT_STATUS_TABLE).where({ id }).update(updateData);
  return db(EMPLOYMENT_STATUS_TABLE).where({ id }).first();
};

/**
 * Remove existing employment status.
 */
export const removeEmploymentStatus = async (id: number): Promise<number> =>
  await db(EMPLOYMENT_STATUS_TABLE).where({ id }).delete();

/**
 * Check if status_code exists.
 */
export const employmentStatusExists = async (
  status_code: string
): Promise<boolean> => {
  const result = await db(EMPLOYMENT_STATUS_TABLE)
    .where({ status_code })
    .count("* as count")
    .first();
  return Number(result?.count || 0) > 0;
};