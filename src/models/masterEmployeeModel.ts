import { EMPLOYEE_TABLE } from "@constants/database.js";
import {
  CreateEmployee,
  GetAllEmployee,
  UpdateEmployee,
  Employee,
  GetEmployeeById,
  UpdateEmployeeByCode,
} from "types/masterEmployeeTypes.js";
import { db } from "@core/config/knex.js";

/**
 * Function for generating employee code
 */
async function generateEmployeeCode() {
  const PREFIX = "KWN";
  const PAD_LENGTH = 7;

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

/**
 * Get all master employees.
 */
export const getAllMasterEmployees = async (): Promise<GetAllEmployee[]> =>
  await db(EMPLOYEE_TABLE)
    .select(
      "master_employees.id",
      "master_employees.employee_code",
      "master_employees.full_name",
      "master_employees.join_date",
      "master_employees.position_code",
      "master_employees.employment_status",

      // Position fields
      "master_positions.position_code",
      "master_positions.name as position_name",

      // Division fields
      "master_divisions.division_code as division_code",
      "master_divisions.name as division_name",

      // Department fields
      "master_departments.department_code as department_code",
      "master_departments.name as department_name"
    )
    .leftJoin(
      "master_positions",
      "master_employees.position_code",
      "master_positions.position_code"
    )
    .leftJoin(
      "master_divisions",
      "master_positions.division_code",
      "master_divisions.division_code"
    )
    .leftJoin(
      "master_departments",
      "master_divisions.department_code",
      "master_departments.department_code"
    );

/**
 * Get employee by ID.
 */
export const getMasterEmployeesById = async (
  id: number
): Promise<GetEmployeeById | null> =>
  await db(EMPLOYEE_TABLE)
    .select(
      // Employee fields
      "master_employees.*",

      // Position fields
      "master_positions.position_code",
      "master_positions.name as position_name",

      // Division fields
      "master_divisions.division_code as division_code",
      "master_divisions.name as division_name",

      // Department fields
      "master_departments.department_code as department_code",
      "master_departments.name as department_name"
    )
    .leftJoin(
      "master_positions",
      "master_employees.position_code",
      "master_positions.position_code"
    )
    .leftJoin(
      "master_divisions",
      "master_positions.division_code",
      "master_divisions.division_code"
    )
    .leftJoin(
      "master_departments",
      "master_divisions.department_code",
      "master_departments.department_code"
    )
    .where({ "master_employees.id": id })
    .first();

/**
 * Get employee by employee code.
 */
export const getMasterEmployeesByCode = async (
  code: string
): Promise<GetEmployeeById | null> =>
  await db(EMPLOYEE_TABLE)
    .select(
      // Employee fields
      "master_employees.*",

      // Position fields
      "master_positions.position_code",
      "master_positions.name as position_name",

      // Division fields
      "master_divisions.division_code as division_code",
      "master_divisions.name as division_name",

      // Department fields
      "master_departments.department_code as department_code",
      "master_departments.name as department_name"
    )
    .leftJoin(
      "master_positions",
      "master_employees.position_code",
      "master_positions.position_code"
    )
    .leftJoin(
      "master_divisions",
      "master_positions.division_code",
      "master_divisions.division_code"
    )
    .leftJoin(
      "master_departments",
      "master_divisions.department_code",
      "master_departments.department_code"
    )
    .where({ "master_employees.employee_code": code })
    .first();
/**
 * Creates new employee.
 */
export const addMasterEmployees = async (
  data: CreateEmployee
): Promise<Employee> => {
  const employee_code = await generateEmployeeCode();
  const employeeToInsert = {
    ...data,
    employee_code,
  };
  const [id] = await db(EMPLOYEE_TABLE).insert(employeeToInsert);

  return db(EMPLOYEE_TABLE).where({ id }).first();
};

/**
 * edit an existing position record.
 */
export const editMasterEmployees = async (
  data: UpdateEmployee
): Promise<Employee | null> => {
  const { id, ...updateData } = data;

  await db(EMPLOYEE_TABLE).where({ id }).update(updateData);
  return db(EMPLOYEE_TABLE).where({ id }).first();
};

/**
 * edit an existing position record by code.
 */
export const editMasterEmployeesByCode = async (
  data: UpdateEmployeeByCode
): Promise<Employee | null> => {
  const { employee_code, ...updateData } = data;

  await db(EMPLOYEE_TABLE).where({ employee_code }).update(updateData);
  return db(EMPLOYEE_TABLE).where({ employee_code }).first();
};

/**
 * Remove existing employee
 */
export const removeMasterEmployees = async (id: number): Promise<number> =>
  await db(EMPLOYEE_TABLE).where({ id }).delete();

export const totalMasterEmployees = async (): Promise<number> => {
  const [totalMasterEmployeeResult] = await db(EMPLOYEE_TABLE).count(
    "id as total_employees"
  );

  const totalMasterEmployees = parseInt(
    String(totalMasterEmployeeResult.total_employees || 0),
    10
  );

  return totalMasterEmployees;
};
