import { db } from "@database/connection.js";
import { OFFICE_TABLE } from "@constants/database.js";
import {
  CreateOffice,
  GetAllOffices,
  GetOfficeById,
  Office,
  UpdateOffice,
} from "./office.types.js";

/**
 * Function for generating office code
 * Format: OFC + 7 digit angka
 */
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

  // Fallback jika parsing gagal
  if (isNaN(lastNumber)) {
    return PREFIX + String(1).padStart(PAD_LENGTH, "0");
  }

  const newNumber = lastNumber + 1;
  return PREFIX + String(newNumber).padStart(PAD_LENGTH, "0");
}

/**
 * Get office by ID.
 */
export const getMasterOfficeById = async (
  id: number
): Promise<GetOfficeById | null> =>
  await db(OFFICE_TABLE).select("*").where({ id }).first();

/**
 * [BARU] Mengambil list kantor dengan PAGINATION (Limit & Offset)
 * Menggantikan getAllMasterOffices yang lama untuk endpoint List
 */
export const getPaginatedOffices = async (
  page: number,
  limit: number
): Promise<any[]> => {
  const offset = (page - 1) * limit;

  return await db(OFFICE_TABLE)
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
};

/**
 * [BARU] Mengambil SEMUA data untuk struktur ORGANIZATION (Tree)
 * Hanya mengambil kolom yang diperlukan untuk visualisasi pohon
 */
export const getAllOfficesOrganization = async (): Promise<any[]> => {
  return await db(OFFICE_TABLE).select(
    "id",
    "office_code",
    "name",
    "address",
    "description",
    "parent_office_code" // Wajib ada untuk logic pohon
  );
};

/**
 * Creates new office.
 */
export const addMasterOffice = async (data: CreateOffice): Promise<Office> => {
  const office_code = await generateOfficeCode();
  const officeToInsert = {
    ...data,
    office_code,
  };

  const [id] = await db(OFFICE_TABLE).insert(officeToInsert);
  return db(OFFICE_TABLE).where({ id }).first();
};

/**
 * Edit an existing office record.
 */
export const editMasterOffice = async (
  data: UpdateOffice
): Promise<Office | null> => {
  const { id, ...updateData } = data;

  await db(OFFICE_TABLE).where({ id }).update(updateData);
  return db(OFFICE_TABLE).where({ id }).first();
};

/**
 * Remove existing office.
 */
export const removeMasterOffice = async (id: number): Promise<number> =>
  await db(OFFICE_TABLE).where({ id }).delete();

// Legacy Function (Opsional, boleh dihapus jika tidak ada modul lain yang pakai)
// Saya matikan export-nya agar Anda dipaksa pakai getPaginatedOffices :)
// export const getAllMasterOffices = async (): Promise<GetAllOffices[]> => await db(OFFICE_TABLE).select("*");
