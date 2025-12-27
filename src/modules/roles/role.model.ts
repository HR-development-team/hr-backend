import { db } from "@database/connection.js";
import {
  ROLE_TABLE,
  FEATURE_TABLE,
  ROLE_PERMISSION_TABLE,
} from "src/common/constants/database.js";
import {
  CreateRole,
  Role,
  GetAllRoleResponse,
  UpdateRole,
  RolePermission,
  GetRoleById,
  RoleOption,
} from "./role.types.js";
import { Knex } from "knex";

/**
 * Function for generating  role code
 */
async function generateRoleCode(): Promise<string> {
  const PREFIX = "ROL";
  const PAD_LENGTH = 7;

  const lastRow = await db(ROLE_TABLE)
    .select("role_code")
    .orderBy("id", "desc")
    .first();

  if (!lastRow) {
    return PREFIX + String(1).padStart(PAD_LENGTH, "0");
  }

  const lastCode = lastRow.role_code;
  const lastNumber = parseInt(lastCode.replace(PREFIX, ""), 10);
  const newNumber = lastNumber + 1;

  return PREFIX + String(newNumber).padStart(PAD_LENGTH, "0");
}

/**
 * Get all roles.
 */
export const getAllRoles = async (
  page: number,
  limit: number,
  search: string
): Promise<GetAllRoleResponse> => {
  const offset = (page - 1) * limit;

  // 1. Base Query
  const query = db(ROLE_TABLE);

  // 2. Search Logic
  if (search) {
    query.andWhere((builder) => {
      builder
        .where("name", "like", `%${search}%`)
        .orWhere("role_code", "like", `%${search}%`);
    });
  }

  // 3. Count Query (Clone strategy)
  const countQuery = query.clone().clearSelect().count("id as total").first();

  // 4. Data Query
  const dataQuery = query
    .select("id", "role_code", "name", "description")
    .limit(limit)
    .offset(offset)
    .orderBy("id", "asc");

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

/**
 * Get role by ID.
 */
export const getRoleById = async (id: number): Promise<GetRoleById | null> =>
  await db(ROLE_TABLE).select("*").where({ id }).first();

export const getRoleOptions = async (search: string): Promise<RoleOption[]> => {
  const query = db(ROLE_TABLE).select("role_code", "name");

  // Search Logic (Autocomplete)
  if (search) {
    query.andWhere((builder) => {
      builder
        .where("name", "like", `%${search}%`)
        .orWhere("role_code", "like", `%${search}%`);
    });
  }

  // Order alphabetically for dropdowns
  return query.orderBy("name", "asc");
};

/**
 * Get role by Code.
 */
export const getRoleByCode = async (
  code: string
): Promise<GetRoleById | null> =>
  await db(ROLE_TABLE).select("*").where({ role_code: code }).first();

/**
 * Creates a new role and initializes its permissions across all features in a transaction.
 */
export const addRole = async (data: CreateRole): Promise<Role> => {
  // Use Knex transaction to ensure atomicity (all or nothing)
  return db.transaction(async (trx: Knex.Transaction) => {
    const role_code = await generateRoleCode();

    // Prepare data for insertion (RoleInsertData)
    const roleToInsert = {
      ...data,
      role_code,
    };
    const [id] = await trx(ROLE_TABLE).insert(roleToInsert);

    // Fetch all existing feature codes
    const features: { feature_code: string }[] =
      await trx(FEATURE_TABLE).select("feature_code");

    // Prepare bulk insert data for 'role_permissions'
    const permissionsToInsert: RolePermission[] = features.map((feature) => ({
      role_code: role_code,
      feature_code: feature.feature_code,
      can_create: false,
      can_read: true,
      can_update: false,
      can_delete: false,
      can_print: false,
    }));

    if (permissionsToInsert.length > 0) {
      await trx(ROLE_PERMISSION_TABLE).insert(permissionsToInsert);
    }

    return trx(ROLE_TABLE).where({ id }).first();
  });
};

/**
 * edit an existing role record.
 */
export const editRole = async (data: UpdateRole): Promise<Role | null> => {
  const { id, ...updateData } = data;

  await db(ROLE_TABLE).where({ id }).update(updateData);
  return db(ROLE_TABLE).where({ id }).first();
};

/**
 * Remove existing role.
 */
export const removeRole = async (id: number): Promise<number> => {
  return db(ROLE_TABLE).where({ id }).delete();
};
