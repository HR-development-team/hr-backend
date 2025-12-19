import { EMPLOYEE_TABLE } from "@common/constants/database.js";
import { db } from "@database/connection.js";

/**
 * Function for generating employee code
 */
export async function generateEmployeeCode() {
  const PREFIX = "MR";
  const PAD_LENGTH = 4;

  const lastRow = await db(EMPLOYEE_TABLE)
    .select("employee_code")
    .orderBy("id", "desc")
    .first();

  if (!lastRow) {
    return PREFIX + String(1).padStart(PAD_LENGTH, "0");
  }

  const lastCode = lastRow.employee_code;
  const lastNumber = parseInt(lastCode.replace(PREFIX, ""), 10);
  const newNumber = lastNumber + 1;
  return PREFIX + String(newNumber).padStart(PAD_LENGTH, "0");
}
