import { db } from "@database/connection.js";
import {
  ROLE_TABLE,
  FEATURE_TABLE,
  ROLE_PERMISSION_TABLE,
} from "src/common/constants/database.js";
import { Knex } from "knex";
import {
  Feature,
  CreateFeature,
  GetAllFeature,
  GetFeatureById,
  UpdateFeature,
  RolePermission,
} from "./feature.types.js";

/**
 * Function for generating feature code
 */
async function generateFeatureCode(): Promise<string> {
  const PREFIX = "FTR";
  const PAD_LENGTH = 7;

  const lastRow = await db(FEATURE_TABLE)
    .select("feature_code")
    .orderBy("id", "desc")
    .first();

  if (!lastRow) {
    return PREFIX + String(1).padStart(PAD_LENGTH, "0");
  }

  const lastCode = lastRow.feature_code;
  const lastNumber = parseInt(lastCode.replace(PREFIX, ""), 10);
  const newNumber = lastNumber + 1;

  return PREFIX + String(newNumber).padStart(PAD_LENGTH, "0");
}

/**
 * Get all features.
 */
export const getAllFeatures = async (): Promise<GetAllFeature[]> => {
  return db(FEATURE_TABLE)
    .select("id", "feature_code", "name", "description")
    .orderBy("id", "asc");
};

/**
 * Get feature by ID.
 */
export const getFeatureById = async (
  id: number
): Promise<GetFeatureById | null> =>
  await db(FEATURE_TABLE).select("*").where({ id }).first();

/**
 * Get feature by Code.
 */
export const getFeatureByCode = async (
  code: string
): Promise<GetFeatureById | null> =>
  await db(FEATURE_TABLE).select("*").where({ feature_code: code }).first();

/**
 * Creates a new feature and initializes its permissions across all roles in a transaction.
 */
export const addFeature = async (data: CreateFeature): Promise<Feature> => {
  // Use Knex transaction to ensure atomicity (all or nothing)
  return db.transaction(async (trx: Knex.Transaction) => {
    const feature_code = await generateFeatureCode();

    // Prepare data for insertion
    const featureToInsert = {
      ...data,
      feature_code,
    };
    const [id] = await trx(FEATURE_TABLE).insert(featureToInsert);

    // Fetch all existing role codes
    const roles: { role_code: string }[] =
      await trx(ROLE_TABLE).select("role_code");

    // Prepare bulk insert data for 'role_permissions'
    const permissionsToInsert: RolePermission[] = roles.map((role) => ({
      role_code: role.role_code,
      feature_code: feature_code,
      can_create: false,
      can_read: true,
      can_update: false,
      can_delete: false,
      can_print: false,
    }));

    if (permissionsToInsert.length > 0) {
      await trx(ROLE_PERMISSION_TABLE).insert(permissionsToInsert);
    }

    return trx(FEATURE_TABLE).where({ id }).first();
  });
};

/**
 * edit an existing feature record.
 */
export const editFeature = async (
  data: UpdateFeature
): Promise<Feature | null> => {
  const { id, ...updateData } = data;

  await db(FEATURE_TABLE).where({ id }).update(updateData);
  return db(FEATURE_TABLE).where({ id }).first();
};

/**
 * Remove existing feature.
 */
export const removeFeature = async (id: number): Promise<number> => {
  return db(FEATURE_TABLE).where({ id }).delete();
};
