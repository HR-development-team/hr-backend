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
import { formatOfficeLocation, officeHierarchyQuery } from "./office.helper.js";
import { Knex } from "knex";

// ==========================================================================
// 2. INTERNAL HELPER
// ==========================================================================
async function generateOfficeCode() {
  const PREFIX = "OFC";
  const PAD_LENGTH = 7;

  const lastRow = await db(OFFICE_TABLE)
    .select("office_code")
    .orderBy("id", "desc")
    .first();

  if (!lastRow) {
    return PREFIX + String(1).padStart(PAD_LENGTH, "0");
  }

  const lastCode = lastRow.office_code;
  const lastNumberString = lastCode.replace(PREFIX, "");
  const lastNumber = parseInt(lastNumberString, 10);

  if (isNaN(lastNumber)) {
    return PREFIX + String(1).padStart(PAD_LENGTH, "0");
  }

  const newNumber = lastNumber + 1;
  return PREFIX + String(newNumber).padStart(PAD_LENGTH, "0");
}

// ==========================================================================
// 3. MAIN EXPORTED FUNCTIONS
// ==========================================================================

/**
 * Get office by ID.
 */
export const getMasterOfficeById = async (
  id: number,
  officeCode: string | null
): Promise<GetOfficeById | null> => {
  if (!officeCode) return null;

  const result = await officeHierarchyQuery(officeCode)
    .select("*")
    .where("office_tree.id", id)
    .first();

  return formatOfficeLocation(result);
};

/**
 * [BARU] Mengambil list kantor dengan PAGINATION
 */
export const getPaginatedOffices = async (
  page: number,
  limit: number,
  officeCode: string | null,
  searchOfficeCode?: string
): Promise<GetAllOffices[]> => {
  const offset = (page - 1) * limit;

  if (!officeCode) return [];

  let query: Knex.QueryBuilder = officeHierarchyQuery(officeCode).select("*");

  if (searchOfficeCode) {
    query = query.where((builder) => {
      builder.where("office_code", "like", `%${searchOfficeCode}%`);
    });
  }

  const result = await query
    .limit(limit)
    .offset(offset)
    .orderBy("sort_order", "asc")
    .orderBy("id", "asc");

  return result.map(formatOfficeLocation);
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

export const getMasterOfficeByCode = async (
  officeCodeParams: string,
  officeCode: string | null
): Promise<GetOfficeById | null> => {
  const result = await officeHierarchyQuery(officeCode)
    .select("*")
    .where("office_tree.office_code", officeCodeParams)
    .first();

  return formatOfficeLocation(result);
};

export const hasChildOffices = async (officeCode: string): Promise<boolean> => {
  const result = await db(OFFICE_TABLE)
    .where("parent_office_code", officeCode)
    .first();
  return !!result; // Return true jika ada anak, false jika tidak
};
