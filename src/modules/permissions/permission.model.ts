import { db } from "@database/connection.js";
import {
  FEATURE_TABLE,
  ROLE_PERMISSION_TABLE,
} from "src/common/constants/database.js";
import {
  GetRolePermission,
  RolePermission,
  UpdateRolePermission,
} from "./permission.types.js";

/**
 *  Get permission from specific role
 */
export const getPermissionByRoleCodeModel = async (
  code: string
): Promise<GetRolePermission[]> =>
  await db(ROLE_PERMISSION_TABLE)
    .select(
      `${ROLE_PERMISSION_TABLE}.role_code`,
      `${ROLE_PERMISSION_TABLE}.feature_code`,
      `${FEATURE_TABLE}.name as feature_name`,
      `${ROLE_PERMISSION_TABLE}.can_create`,
      `${ROLE_PERMISSION_TABLE}.can_read`,
      `${ROLE_PERMISSION_TABLE}.can_update`,
      `${ROLE_PERMISSION_TABLE}.can_delete`,
      `${ROLE_PERMISSION_TABLE}.can_print`
    )
    .innerJoin(
      FEATURE_TABLE,
      `${FEATURE_TABLE}.feature_code`,
      `${ROLE_PERMISSION_TABLE}.feature_code`
    )
    .where({ [`${ROLE_PERMISSION_TABLE}.role_code`]: code })
    .orderBy(`${FEATURE_TABLE}.name`);

/**
 * Update permission using TRUNCATE/INSERT statement
 */
export const updateRolePermission = async (
  code: string,
  data: UpdateRolePermission
): Promise<RolePermission[]> => {
  // Use Knex transaction to ensure atomicity (all or nothing)
  return await db.transaction(async (trx) => {
    // Delete all existing permissions for the given role_code
    await trx(ROLE_PERMISSION_TABLE).where({ role_code: code }).del();

    const permissionsToInsert = data.permissions.map((p) => ({
      ...p,
      role_code: code,
    }));

    if (permissionsToInsert.length > 0) {
      await trx(ROLE_PERMISSION_TABLE).insert(permissionsToInsert);
    }

    return trx(ROLE_PERMISSION_TABLE).where({ role_code: code }).select("*");
  });
};
