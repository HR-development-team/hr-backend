import { DIVISION_TABLE } from "@common/constants/database.js";
import { db } from "@database/connection.js";

/**
 * Function for generating division code
 */
export async function generateDivisionCode(
  officeCode: string,
  departmentCode: string
) {
  const PREFIX = "DIV";
  const OFFICE_PAD_LENGTH = 2;
  const DEPARTMENT_PAD_LENGTH = 2;
  const SEQUENCE_PAD_LENGTH = 3;

  const officeSuffix = officeCode.slice(-OFFICE_PAD_LENGTH);
  const deptSuffix = departmentCode.slice(-DEPARTMENT_PAD_LENGTH);

  const lastRow = await db(DIVISION_TABLE)
    .where("department_code", departmentCode)
    .orderBy("division_code", "desc")
    .first();

  let nextSequence = 1;

  if (lastRow) {
    const lastCode = lastRow.division_code;

    const lastSequenceStr = lastCode.slice(-SEQUENCE_PAD_LENGTH);
    const lastSequence = parseInt(lastSequenceStr, 10);

    if (!isNaN(lastSequence)) {
      nextSequence = lastSequence + 1;
    }
  }

  const sequencePrefix = String(nextSequence).padStart(
    SEQUENCE_PAD_LENGTH,
    "0"
  );

  return `${PREFIX}${officeSuffix}${deptSuffix}${sequencePrefix}`;
}

export const isDivisionNameExist = async (
  departmentCode: string,
  name: string
): Promise<Boolean> => {
  const result = await db(DIVISION_TABLE)
    .where({
      department_code: departmentCode,
      name: name,
    })
    .first();

  return !!result;
};

export const formatDivisionReponse = (item: any) => {
  const {
    leader_name,
    leader_employee_code,
    leader_role,
    leader_position,
    ...divData
  } = item;

  if (!item) return null;
  return {
    ...divData,
    // Konversi string ke float, atau null jika datanya kosong
    leader: leader_employee_code
      ? {
          employee_code: leader_employee_code,
          name: leader_name,
          role: leader_role,
          position: leader_position,
        }
      : null,
  };
};
