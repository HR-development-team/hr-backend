import { db } from "@database/connection.js";
import { OFFICE_TABLE } from "@constants/database.js";
import {
  CreateOffice,
  GetAllOffices,
  GetOfficeById,
  Office,
  OfficeReference,
  UpdateOffice,
} from "./office.types.js";
import {
  formatOfficeLocation,
  generateOfficeCode,
  officeHierarchyQuery,
} from "./office.helper.js";
import { Knex } from "knex";

// ==========================================================================
// 3. MAIN EXPORTED FUNCTIONS
// ==========================================================================

/**
 * [BARU] Mengambil list kantor dengan PAGINATION
 */
export const getPaginatedOffices = async (
  page: number,
  limit: number,
  userOfficeCode: string | null,
  search?: string
): Promise<GetAllOffices[]> => {
  const offset = (page - 1) * limit;

  if (!userOfficeCode) return [];

  let query: Knex.QueryBuilder = officeHierarchyQuery(userOfficeCode)
    .select("office_tree.*", "parent.name as parent_office_name")
    .leftJoin(
      `${OFFICE_TABLE} as parent`,
      "office_tree.parent_office_code",
      "parent.office_code"
    );

  if (search) {
    query = query.where((builder) => {
      builder
        .where("office_code", "like", `%${search}%`)
        .orWhere("name", "like", `%${search}%`);
    });
  }

  const result = await query
    .limit(limit)
    .offset(offset)
    .orderBy("sort_order", "asc")
    .orderBy("id", "asc");

  return result.map(formatOfficeLocation);
};

/**
 * Get office by ID.
 */
export const getMasterOfficeById = async (
  id: number,
  userOfficeCode: string | null
): Promise<GetOfficeById | null> => {
  if (!userOfficeCode) return null;

  const result = await officeHierarchyQuery(userOfficeCode)
    .select("office_tree.*", "parent.name as parent_office_name")
    .leftJoin(
      `${OFFICE_TABLE} as parent`,
      "office_tree.parent_office_code",
      "parent.office_code"
    )
    .where("office_tree.id", id)
    .first();

  return formatOfficeLocation(result);
};

export const getMasterOfficeByCode = async (
  officeCodeParams: string,
  officeCode: string | null
): Promise<GetOfficeById | null> => {
  const result = await officeHierarchyQuery(officeCode)
    .select("office_tree.*", "parent.name as parent_office_name")
    .leftJoin(
      `${OFFICE_TABLE} as parent`,
      "office_tree.parent_office_code",
      "parent.office_code"
    )
    .where("office_tree.office_code", officeCodeParams)
    .first();

  return formatOfficeLocation(result);
};

export const getOfficeReference = async (
  officeCode: string | null
): Promise<OfficeReference[]> => {
  if (!officeCode) return [];

  const result = await officeHierarchyQuery(officeCode)
    .select("name", "office_code")
    .orderBy("sort_order", "asc")
    .orderBy("name", "asc");

  return result;
};

/**
 * [BARU] Mengambil SEMUA data untuk struktur ORGANIZATION (Tree)
 */
export const getAllOfficesOrganization = async (): Promise<any[]> => {
  const results = await db(OFFICE_TABLE).select(
    "id",
    "office_code",
    "name",
    "address",
    "description",
    "parent_office_code",
    "latitude",
    "longitude"
  );

  return results.map(formatOfficeLocation);
};

/**
 * Creates new office.
 */
export const addMasterOffice = async (data: CreateOffice): Promise<Office> => {
  const office_code = await generateOfficeCode();

  let finalSortOrder = data.sort_order;
  if (!finalSortOrder) {
    const maxResult = await db(OFFICE_TABLE)
      .max("sort_order as maxVal")
      .first();
    const maxVal = maxResult?.maxVal as number | null;
    finalSortOrder = (maxVal || 0) + 1;
  }

  const officeToInsert = {
    parent_office_code: data.parent_office_code || null,
    office_code,
    name: data.name,
    address: data.address,
    latitude: data.latitude,
    longitude: data.longitude,
    radius_meters: data.radius_meters,
    sort_order: finalSortOrder,
    description: data.description || null,
  };

  const [id] = await db(OFFICE_TABLE).insert(officeToInsert);

  // SELECT EKSPLISIT (Agar urutan rapi & tanpa created_at/updated_at)
  const result = await db(OFFICE_TABLE)
    .select(
      "id",
      "office_code",
      "parent_office_code",
      "name",
      "address",
      "latitude",
      "longitude",
      "radius_meters",
      "sort_order", // <--- Posisi di atas description
      "description"
    )
    .where({ id })
    .first();

  return formatOfficeLocation(result);
};

/**
 * Edit an existing office record.
 */
// FIX PRETTIER: Parameter diturunkan ke bawah
export const editMasterOffice = async (
  data: UpdateOffice
): Promise<Office | null> => {
  const { id, ...updateData } = data;

  await db(OFFICE_TABLE).where({ id }).update(updateData);

  // SELECT EKSPLISIT (Agar urutan rapi & tanpa created_at/updated_at)
  const result = await db(OFFICE_TABLE)
    .select(
      "id",
      "office_code",
      "parent_office_code",
      "name",
      "address",
      "latitude",
      "longitude",
      "radius_meters",
      "sort_order", // <--- Posisi di atas description
      "description"
    )
    .where({ id })
    .first();

  return formatOfficeLocation(result);
};

export const removeMasterOffice = async (id: number): Promise<number> =>
  await db(OFFICE_TABLE).where({ id }).delete();

export const hasChildOffices = async (officeCode: string): Promise<boolean> => {
  const result = await db(OFFICE_TABLE)
    .where("parent_office_code", officeCode)
    .first();
  return !!result; // Return true jika ada anak, false jika tidak
};
