// status.model.ts
import { db } from "@database/connection.js";
import { EMPLOYMENT_STATUS_TABLE } from "@constants/database.js";
import {
  CreateEmploymentStatus,
  EmploymentStatusOption,
  GetAllEmploymentStatusResponse,
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
  limit: number,
  search: string
): Promise<GetAllEmploymentStatusResponse> => {
  const offset = (page - 1) * limit;

  // 1. Base Query
  const query = db(EMPLOYMENT_STATUS_TABLE);

  // 2. Search Logic
  if (search) {
    query.andWhere((builder) => {
      builder
        .where("name", "like", `%${search}%`)
        .orWhere("status_code", "like", `%${search}%`);
    });
  }

  // 3. Count Query
  const countQuery = query.clone().clearSelect().count("id as total").first();

  // 4. Data Query
  const dataQuery = query
    .select("id", "status_code", "name", "description")
    .limit(limit)
    .offset(offset)
    .orderBy("created_at", "desc");

  // 5. Execute in Parallel
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

export const getEmploymentStatusOptions = async (
  search: string
): Promise<EmploymentStatusOption[]> => {
  const query = db(EMPLOYMENT_STATUS_TABLE).select("status_code", "name");

  // Search Logic (Autocomplete)
  if (search) {
    query.andWhere((builder) => {
      builder
        .where("name", "like", `%${search}%`)
        .orWhere("status_code", "like", `%${search}%`);
    });
  }

  // Order alphabetically for dropdowns
  return query.orderBy("name", "asc");
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
