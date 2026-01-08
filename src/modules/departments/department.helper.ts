import { DEPARTMENT_TABLE } from "@common/constants/database.js";
import { GetDepartmentDetail } from "./department.types.js";
import { db } from "@database/connection.js";

/**
 * Function for generating department code
 */
export async function generateDepartmentCode(office_code: string) {
  const PREFIX = "DPT";
  const OFFICE_PAD_LENGTH = 2;
  const SEQUENCE_PAD_LENGTH = 5;

  const officeNumberMatch = office_code.match(/\d+$/);
  const officeNumber = officeNumberMatch
    ? parseInt(officeNumberMatch[0], 10)
    : 0;

  const officePrefix = String(officeNumber).padStart(OFFICE_PAD_LENGTH, "0");

  const lastRow = await db(DEPARTMENT_TABLE)
    .where("office_code", office_code)
    .orderBy("department_code", "desc")
    .first();

  if (!lastRow) {
    return `${PREFIX}${officePrefix}${String(1).padStart(SEQUENCE_PAD_LENGTH, "0")}`;
  }

  const lastCode = lastRow.department_code;
  const lastSequenceStr = lastCode.slice(-SEQUENCE_PAD_LENGTH);
  const lastSequence = parseInt(lastSequenceStr, 10);

  const newSequence = lastSequence + 1;
  return `${PREFIX}${officePrefix}${String(newSequence).padStart(SEQUENCE_PAD_LENGTH, "0")}`;
}

export const isDepartmentNameExist = async (
  office_code: string,
  name: string
): Promise<GetDepartmentDetail> => {
  const result = await db(DEPARTMENT_TABLE)
    .where({
      office_code: office_code,
      name: name,
    })
    .first();

  return result;
};

export const getDepartmentsById = async (
  id: number
): Promise<GetDepartmentDetail> => {
  const result = db(DEPARTMENT_TABLE).where("id", id).first();

  return result;
};

export const formatDepartmentResponse = (item: any) => {
  const {
    leader_name,
    leader_employee_code,
    leader_role,
    leader_position,
    ...deptData
  } = item;

  if (!item) return null;
  return {
    ...deptData,
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
