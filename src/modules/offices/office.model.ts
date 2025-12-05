import { db } from "@database/connection.js";
import { OFFICE_TABLE } from "@constants/database.js";
import {
  CreateOffice,
  GetOfficeById,
  Office,
  UpdateOffice,
} from "./office.types.js";

// ==========================================================================
// 1. HELPER FUNCTION
// ==========================================================================
const formatOfficeLocation = (item: any) => {
  if (!item) return null;
  return {
    ...item,
    // Konversi string ke float, atau null jika datanya kosong
    latitude: item.latitude ? parseFloat(item.latitude) : null,
    longitude: item.longitude ? parseFloat(item.longitude) : null,
  };
};

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
export const getMasterOfficeById = async (id: number): Promise<any | null> => {
  const result = await db(`${OFFICE_TABLE} as child`)
    .select(
      "child.id",
      "child.office_code",
      "child.parent_office_code",
      "child.name",
      "parent.name as parent_office_name",
      "child.address",
      "child.latitude",
      "child.longitude",
      "child.radius_meters",
      "child.sort_order",
      "child.description"
    )
    .leftJoin(
      `${OFFICE_TABLE} as parent`,
      "child.parent_office_code",
      "parent.office_code"
    )
    .where("child.id", id)
    .first();

  return formatOfficeLocation(result);
};

/**
 * [BARU] Mengambil list kantor dengan PAGINATION
 */
export const getPaginatedOffices = async (
  page: number,
  limit: number
): Promise<any[]> => {
  const offset = (page - 1) * limit;

  const results = await db(OFFICE_TABLE)
    .select(
      "id",
      "office_code",
      "parent_office_code",
      "name",
      "address",
      "latitude",
      "longitude",
      "radius_meters",
      "sort_order",
      "description"
    )
    .limit(limit)
    .offset(offset)
    .orderBy("sort_order", "asc")
    .orderBy("id", "asc");

  return results.map(formatOfficeLocation);
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
  officeCode: string
): Promise<any | null> => {
  const result = await db(`${OFFICE_TABLE} as child`)
    .select(
      "child.id",
      "child.office_code",
      "child.parent_office_code",
      "child.name",
      "parent.name as parent_office_name", // Ambil nama parent
      "child.address",
      "child.latitude",
      "child.longitude",
      "child.radius_meters",
      "child.sort_order",
      "child.description"
    )
    .leftJoin(
      `${OFFICE_TABLE} as parent`,
      "child.parent_office_code",
      "parent.office_code"
    )
    .where("child.office_code", officeCode)
    .first();

  return formatOfficeLocation(result);
};

export const hasChildOffices = async (officeCode: string): Promise<boolean> => {
  const result = await db(OFFICE_TABLE)
    .where("parent_office_code", officeCode)
    .first();
  return !!result; // Return true jika ada anak, false jika tidak
};
