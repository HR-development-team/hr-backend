import { db } from "@database/connection.js";
import {
  ROLE_TABLE,
  FEATURE_TABLE,
  ROLE_PERMISSION_TABLE,
} from "src/common/constants/database.js"; // Assuming you define these constants
import {
  CreateRole,
  Role,
  GetAllRole,
  UpdateRole,
  RolePermission,
  GetRoleById,
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
export const getAllRoles = async (): Promise<GetAllRole[]> => {
  return db(ROLE_TABLE)
    .select("id", "role_code", "name", "description")
    .orderBy("id", "asc");
};

/**
 * Get role by ID.
 */
export const getRoleById = async (id: number): Promise<GetRoleById | null> =>
  await db(ROLE_TABLE).select("*").where({ id }).first();

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
