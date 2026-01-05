import { BANK_TABLE } from "@common/constants/database.js";
import { GetAllBankOptions } from "./banks.types.js";
import { db } from "@database/connection.js";

/**
 * Get all bank options
 */
export const getAllBankOptions = async (
  search?: string
): Promise<GetAllBankOptions[]> => {
  const query = db(BANK_TABLE).select(
    `${BANK_TABLE}.bank_name`,
    `${BANK_TABLE}.bank_code`,
    `${BANK_TABLE}.alias`
  );

  if (search) {
    query
      .where(`${BANK_TABLE}.bank_code`, "like", `%${search}%`)
      .orWhere(`${BANK_TABLE}.bank_name`, "like", `%${search}%`)
      .orWhere(`${BANK_TABLE}.alias`, "like", `%${search}%`);
  }

  return query.orderBy(`${BANK_TABLE}.alias`, "asc");
};
