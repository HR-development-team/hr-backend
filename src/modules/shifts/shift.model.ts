import { db } from "@database/connection.js";
import { OFFICE_TABLE, SHIFT_TABLE } from "@constants/database.js";
import {
  CreateShift,
  GetAllShifts,
  UpdateShift,
  Shift,
} from "./shift.types.js";

/**
 * Function for generating shift code
 */
async function generateShiftCode() {
  const PREFIX = "SFT";
  const PAD_LENGTH = 7;

  const lastRow = await db(SHIFT_TABLE)
    .select("shift_code")
    .orderBy("id", "desc")
    .first();

  if (!lastRow) {
    return PREFIX + String(1).padStart(PAD_LENGTH, "0");
  }

  const lastCode = lastRow.shift_code;
  const lastNumber = parseInt(lastCode.replace(PREFIX, ""), 10);
  const newNumber = lastNumber + 1;
  return PREFIX + String(newNumber).padStart(PAD_LENGTH, "0");
}

/**
 * Get all shift.
 */
export const getAllMasterShifts = async (): Promise<GetAllShifts[]> =>
  await db(SHIFT_TABLE)
    .select(
      `${SHIFT_TABLE}.id`,
      `${SHIFT_TABLE}.office_code`,
      `${OFFICE_TABLE}.name as office_name`,
      `${SHIFT_TABLE}.shift_code`,
      `${SHIFT_TABLE}.name`,
      `${SHIFT_TABLE}.start_time`,
      `${SHIFT_TABLE}.end_time`,
      `${SHIFT_TABLE}.is_overnight`,
      `${SHIFT_TABLE}.late_tolerance_minutes`,
      `${SHIFT_TABLE}.check_in_limit_minutes`,
      `${SHIFT_TABLE}.check_out_limit_minutes`,
      `${SHIFT_TABLE}.work_days`
    )
    .leftJoin(
      `${OFFICE_TABLE}`,
      `${SHIFT_TABLE}.office_code`,
      `${OFFICE_TABLE}.office_code`
    );

/**
 * Get shift by ID.
 */
export const getMasterShiftsById = async (id: number): Promise<Shift> =>
  await db(SHIFT_TABLE)
    .where(`${SHIFT_TABLE}.id`, id)
    .select(`${SHIFT_TABLE}.*`, `${OFFICE_TABLE}.name as office_name`)
    .leftJoin(
      `${OFFICE_TABLE}`,
      `${SHIFT_TABLE}.office_code`,
      `${OFFICE_TABLE}.office_code`
    )
    .first();

/**
 * Creates new shift.
 */
export const addMasterShifts = async (data: CreateShift): Promise<Shift> => {
  const shift_code = await generateShiftCode();
  const shiftToInsert = {
    shift_code,
    ...data,
    work_days: JSON.stringify(data.work_days),
  };
  const [id] = await db(SHIFT_TABLE).insert(shiftToInsert);
  return db(SHIFT_TABLE)
    .where(`${SHIFT_TABLE}.id`, id)
    .select(`${SHIFT_TABLE}.*`, `${OFFICE_TABLE}.name as office_name`)
    .leftJoin(
      `${OFFICE_TABLE}`,
      `${SHIFT_TABLE}.office_code`,
      `${OFFICE_TABLE}.office_code`
    )
    .first();
};

/**
 * Edit an existing shift record.
 */
export const editMasterShift = async (
  data: UpdateShift
): Promise<Shift | null> => {
  const { id, ...updateData } = data;

  await db(SHIFT_TABLE).where({ id }).update(updateData);
  return db(SHIFT_TABLE)
    .where(`${SHIFT_TABLE}.id`, id)
    .select(`${SHIFT_TABLE}.*`, `${OFFICE_TABLE}.name as office_name`)
    .leftJoin(
      `${OFFICE_TABLE}`,
      `${SHIFT_TABLE}.office_code`,
      `${OFFICE_TABLE}.office_code`
    )
    .first();
};

/**
 * Remove existing shift.
 */
export const removeMasterShift = async (id: number): Promise<number> =>
  await db(SHIFT_TABLE).where(`${SHIFT_TABLE}.id`, id).delete();
