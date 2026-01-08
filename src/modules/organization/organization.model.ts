import {
  DEPARTMENT_TABLE,
  DIVISION_TABLE,
  EMPLOYEE_TABLE,
  OFFICE_TABLE,
  POSITION_TABLE,
} from "@common/constants/database.js";
import { db } from "@database/connection.js";
import {
  DepartmentNode,
  DivisionNode,
  OfficeNode,
} from "./organization.type.js";

export const getOfficeInfo = async (
  officeCode: string
): Promise<OfficeNode> => {
  return await db(OFFICE_TABLE)
    .select("id", "office_code", "name", "address", "description")
    .where("office_code", officeCode)
    .first();
};

export const getDepartmentsByScope = async (
  officeCode: string[]
): Promise<DepartmentNode[]> => {
  if (officeCode.length === 0) return [];

  return await db(DEPARTMENT_TABLE)
    .select("id", "department_code", "office_code", "name", "description")
    .whereIn("office_code", officeCode)
    .orderBy("name", "asc");
};

export const getDivisionsByScope = async (
  officeCode: string[]
): Promise<DivisionNode[]> => {
  if (officeCode.length === 0) return [];

  return await db(DIVISION_TABLE)
    .select(
      `${DIVISION_TABLE}.id`,
      `${DIVISION_TABLE}.division_code`,
      `${DIVISION_TABLE}.department_code`,
      `${DIVISION_TABLE}.name`,
      `${DIVISION_TABLE}.description`
    )
    .leftJoin(
      `${DEPARTMENT_TABLE}`,
      `${DIVISION_TABLE}.department_code`,
      `${DEPARTMENT_TABLE}.department_code`
    )
    .whereIn(`${DEPARTMENT_TABLE}.office_code`, officeCode)
    .orderBy(`${DIVISION_TABLE}.name`, "asc");
};

export const getPositionsByScope = async (officeCode: string[]) => {
  if (officeCode.length === 0) return [];

  return await db(POSITION_TABLE)
    .select(
      `${POSITION_TABLE}.id`,
      `${POSITION_TABLE}.position_code`,
      `${POSITION_TABLE}.division_code`,
      `${POSITION_TABLE}.name`,

      // employee table
      `${EMPLOYEE_TABLE}.full_name as employee_name`,
      `${EMPLOYEE_TABLE}.employee_code`
    )
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${POSITION_TABLE}.position_code`,
      `${EMPLOYEE_TABLE}.position_code`
    )
    .leftJoin(
      `${DIVISION_TABLE}`,
      `${POSITION_TABLE}.division_code`,
      `${DIVISION_TABLE}.division_code`
    )
    .leftJoin(
      `${DEPARTMENT_TABLE}`,
      `${DIVISION_TABLE}.department_code`,
      `${DEPARTMENT_TABLE}.department_code`
    )
    .whereIn(`${DEPARTMENT_TABLE}.office_code`, officeCode)
    .orderBy(`${POSITION_TABLE}.name`, "asc");
};
