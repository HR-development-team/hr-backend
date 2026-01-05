import { BANK_ACCOUNT_TABLE, BANK_TABLE } from "@common/constants/database.js";
import { db } from "@database/connection.js";
import { CreateBankAccount, UpdateBankAccount } from "./bank-account.types.js";

export async function generateBankAccountCode() {
  const PREFIX = "BNA";
  const PAD_LENGTH = 7;

  const lastRow = await db(BANK_ACCOUNT_TABLE)
    .select("bank_account_code")
    .orderBy("id", "desc")
    .first();

  if (!lastRow) {
    return PREFIX + String(1).padStart(PAD_LENGTH, "0");
  }

  const lastCode = lastRow.bank_account_code;
  const lastNumberString = lastCode.replace(PREFIX, "");
  const lastNumber = parseInt(lastNumberString, 10);

  if (isNaN(lastNumber)) {
    return PREFIX + String(1).padStart(PAD_LENGTH, "0");
  }

  const newNumber = lastNumber + 1;
  return PREFIX + String(newNumber).padStart(PAD_LENGTH, "0");
}

/**
 * Create new bank account
 */
export const addBankAccount = async (data: CreateBankAccount) => {
  const bank_account_code = await generateBankAccountCode();

  const [id] = await db(BANK_ACCOUNT_TABLE).insert({
    bank_account_code,
    ...data,
  });

  return db(BANK_ACCOUNT_TABLE)
    .where(`${BANK_ACCOUNT_TABLE}.id`, id)
    .select(`${BANK_ACCOUNT_TABLE}.*`, `${BANK_TABLE}.alias as bank_alias`)
    .leftJoin(
      `${BANK_TABLE}`,
      `${BANK_ACCOUNT_TABLE}.bank_code`,
      `${BANK_TABLE}.bank_code`
    )
    .first();
};

/**
 * Create new bank account
 */
export const editBankAccountByEmployeeCode = async (
  employee_code: string,
  data: UpdateBankAccount
) => {
  const { ...updatedData } = data;

  await db(BANK_ACCOUNT_TABLE)
    .where({ employee_code })
    .update({ ...updatedData, updated_at: new Date() });

  return db(BANK_ACCOUNT_TABLE)
    .where({ employee_code })
    .select(`${BANK_ACCOUNT_TABLE}.*`, `${BANK_TABLE}.alias as bank_alias`)
    .leftJoin(
      `${BANK_TABLE}`,
      `${BANK_ACCOUNT_TABLE}.bank_code`,
      `${BANK_TABLE}.bank_code`
    )
    .first();
};
