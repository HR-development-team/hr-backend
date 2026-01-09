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
  OfficeHierarchyNode,
} from "./organization.type.js";

/**
 * 1. Get Office Info with Leader Details
 */
export const getOfficeInfo = async (
  officeCode: string
): Promise<OfficeNode> => {
  return await db(OFFICE_TABLE)
    .select(
      `${OFFICE_TABLE}.id`,
      `${OFFICE_TABLE}.office_code`,
      `${OFFICE_TABLE}.name`,
      `${OFFICE_TABLE}.address`,
      `${OFFICE_TABLE}.description`,
      // Leader Info
      `${POSITION_TABLE}.name as leader_position_name`,
      `${EMPLOYEE_TABLE}.full_name as leader_employee_name`
    )
    .leftJoin(
      `${POSITION_TABLE}`,
      `${OFFICE_TABLE}.leader_position_code`,
      `${POSITION_TABLE}.position_code`
    )
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${POSITION_TABLE}.position_code`, // Join employee on the position code
      `${EMPLOYEE_TABLE}.position_code`
    )
    .where(`${OFFICE_TABLE}.office_code`, officeCode)
    .first();
};

/**
 * 2. Get Departments with Leader Details
 */
export const getDepartmentsByScope = async (
  officeCode: string[]
): Promise<DepartmentNode[]> => {
  if (officeCode.length === 0) return [];

  return await db(DEPARTMENT_TABLE)
    .select(
      `${DEPARTMENT_TABLE}.id`,
      `${DEPARTMENT_TABLE}.department_code`,
      `${DEPARTMENT_TABLE}.office_code`,
      `${DEPARTMENT_TABLE}.name`,
      `${DEPARTMENT_TABLE}.description`,
      // Leader Info
      `${POSITION_TABLE}.name as leader_position_name`,
      `${EMPLOYEE_TABLE}.full_name as leader_employee_name`
    )
    .leftJoin(
      `${POSITION_TABLE}`,
      `${DEPARTMENT_TABLE}.leader_position_code`,
      `${POSITION_TABLE}.position_code`
    )
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${POSITION_TABLE}.position_code`,
      `${EMPLOYEE_TABLE}.position_code`
    )
    .whereIn(`${DEPARTMENT_TABLE}.office_code`, officeCode)
    .orderBy(`${DEPARTMENT_TABLE}.name`, "asc");
};

/**
 * 3. Get Divisions with Leader Details
 */
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
      `${DIVISION_TABLE}.description`,
      // Leader Info
      `${POSITION_TABLE}.name as leader_position_name`,
      `${EMPLOYEE_TABLE}.full_name as leader_employee_name`
    )
    // Join Dept to filter by Office Scope
    .leftJoin(
      `${DEPARTMENT_TABLE}`,
      `${DIVISION_TABLE}.department_code`,
      `${DEPARTMENT_TABLE}.department_code`
    )
    // Join Position (Leader)
    .leftJoin(
      `${POSITION_TABLE}`,
      `${DIVISION_TABLE}.leader_position_code`,
      `${POSITION_TABLE}.position_code`
    )
    // Join Employee (Leader)
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${POSITION_TABLE}.position_code`,
      `${EMPLOYEE_TABLE}.position_code`
    )
    .whereIn(`${DEPARTMENT_TABLE}.office_code`, officeCode)
    .orderBy(`${DIVISION_TABLE}.name`, "asc");
};

/**
 * 4. Get Positions (Leaf Nodes)
 * No changes needed here usually, unless you want to clean it up.
 */
export const getPositionsByScope = async (officeCode: string[]) => {
  if (officeCode.length === 0) return [];

  return await db(POSITION_TABLE)
    .select(
      `${POSITION_TABLE}.id`,
      `${POSITION_TABLE}.position_code`,
      `${POSITION_TABLE}.division_code`,
      `${POSITION_TABLE}.department_code`, // Ideally select this too for mapping
      `${POSITION_TABLE}.office_code`, // Ideally select this too
      `${POSITION_TABLE}.name`,
      `${EMPLOYEE_TABLE}.full_name as employee_name`,
      `${EMPLOYEE_TABLE}.employee_code`
    )
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${POSITION_TABLE}.position_code`,
      `${EMPLOYEE_TABLE}.position_code`
    )
    // We join these just to filter scope, though if POSITION has office_code we could simplify
    .leftJoin(
      `${DEPARTMENT_TABLE}`,
      `${POSITION_TABLE}.department_code`,
      `${DEPARTMENT_TABLE}.department_code`
    )
    .whereIn(`${POSITION_TABLE}.office_code`, officeCode) // Optimization: Use position's own office_code
    .orderBy(`${POSITION_TABLE}.name`, "asc");
};

/**
 * Fetch all offices with leader details for hierarchy construction
 */
export const getAllOfficesWithLeaders = async (): Promise<
  OfficeHierarchyNode[]
> => {
  return await db(OFFICE_TABLE)
    .select(
      `${OFFICE_TABLE}.id`,
      `${OFFICE_TABLE}.office_code`,
      `${OFFICE_TABLE}.parent_office_code`,
      `${OFFICE_TABLE}.name`,
      `${OFFICE_TABLE}.address`,
      `${OFFICE_TABLE}.description`,
      // Leader Info
      `${POSITION_TABLE}.name as leader_position_name`,
      `${EMPLOYEE_TABLE}.full_name as leader_employee_name`
    )
    .leftJoin(
      `${POSITION_TABLE}`,
      `${OFFICE_TABLE}.leader_position_code`,
      `${POSITION_TABLE}.position_code`
    )
    .leftJoin(
      `${EMPLOYEE_TABLE}`,
      `${POSITION_TABLE}.position_code`,
      `${EMPLOYEE_TABLE}.position_code`
    )
    .orderBy(`${OFFICE_TABLE}.sort_order`, "asc");
};
