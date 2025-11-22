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
  const lastNumber = parseInt(lastCode.replace(PREFIX, ""), 10);
  const newNumber = lastNumber + 1;

  return PREFIX + String(newNumber).padStart(PAD_LENGTH, "0");
}

/**
 * Get all master offices.
 */
export const getAllMasterOffices = async (): Promise<GetAllOffices[]> =>
  await db(OFFICE_TABLE).select(
    "id",
    "office_code",
    "name",
    "address",
    "latitude",
    "longitude",
    "radius_meters"
  );

/**
 * Get office by ID.
 */
export const getMasterOfficeById = async (
  id: number
): Promise<GetOfficeById | null> =>
  await db(OFFICE_TABLE).select("*").where({ id }).first();

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
