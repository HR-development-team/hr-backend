import { SHIFT_TABLE } from "@common/constants/database.js";
import { db } from "@database/connection.js";

export const validateShiftScopeService = async (
  shiftCode: string | null,
  officeCode: string | null | undefined
): Promise<boolean> => {
  if (!shiftCode) return false;

  const shift = await db(SHIFT_TABLE)
    .select("office_code")
    .where("shift_code", shiftCode)
    .first();

  if (!shift) return false;

  if (shift.office_code === null) return true;

  if (!officeCode) return true;

  if (shift.office_code === officeCode) return true;

  return false;
};
