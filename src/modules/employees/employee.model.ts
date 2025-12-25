import { db } from "@database/connection.js";
import {
  DEPARTMENT_TABLE,
  DIVISION_TABLE,
  EMPLOYEE_TABLE,
  EMPLOYMENT_STATUS_TABLE,
  OFFICE_TABLE,
  POSITION_TABLE,
  SHIFT_TABLE,
} from "@constants/database.js";
import {
  CreateEmployee,
  GetAllEmployee,
  UpdateEmployee,
  Employee,
  GetEmployeeById,
  UpdateEmployeeByCode,
} from "./employee.types.js";
import { generateEmployeeCode } from "./employee.helper.js";
import { officeHierarchyQuery } from "@modules/offices/office.helper.js";

/**
 * Get all master employees.
 */
export const getAllMasterEmployees = async (
  page: number,
  limit: number,
  userOfficeCode: string | "",
  search: string,
  officeCodeFilter: string | "",
  divisionCodeFilter: string | "",
  positionCodeFilter: string | ""
): Promise<GetAllEmployee[]> => {
  const offset = (page - 1) * limit;

  const query = db(EMPLOYEE_TABLE)
    .select(
      `${EMPLOYEE_TABLE}.*`,

      // shift table
      `${SHIFT_TABLE}.name as shift_name`,

      // Employment status fields
      `${EMPLOYMENT_STATUS_TABLE}.status_code as employment_status_code`,
      `${EMPLOYMENT_STATUS_TABLE}.name as employment_status`,

      // Office fields
      `${OFFICE_TABLE}.office_code`,
      `${OFFICE_TABLE}.name as office_name`,

      // Position fields
      `${POSITION_TABLE}.position_code`,
      `${POSITION_TABLE}.name as position_name`,

      // Division fields
      `${DIVISION_TABLE}.division_code`,
      `${DIVISION_TABLE}.name as division_name`,

      // Department fields
      `${DEPARTMENT_TABLE}.department_code`,
      `${DEPARTMENT_TABLE}.name as department_name`,

      // Office fields
      `${OFFICE_TABLE}.name as office_name`
    )
    .leftJoin(
      `${POSITION_TABLE}`,
      `${EMPLOYEE_TABLE}.position_code`,
      `${POSITION_TABLE}.position_code`
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
    .leftJoin(
      `${OFFICE_TABLE}`,
      `${EMPLOYEE_TABLE}.office_code`,
      `${OFFICE_TABLE}.office_code`
    )
    .leftJoin(
      `${EMPLOYMENT_STATUS_TABLE}`,
      `${EMPLOYEE_TABLE}.employment_status_code`,
      `${EMPLOYMENT_STATUS_TABLE}.status_code`
    )
    .leftJoin(
      `${SHIFT_TABLE}`,
      `${EMPLOYEE_TABLE}.shift_code`,
      `${SHIFT_TABLE}.shift_code`
    );

  if (userOfficeCode) {
    const allowedOfficesSubquery =
      officeHierarchyQuery(userOfficeCode).select("office_code");

    query.whereIn(`${EMPLOYEE_TABLE}.office_code`, allowedOfficesSubquery);
  }

  if (search) {
    query.andWhere((builder) => {
      builder
        .where(`${EMPLOYEE_TABLE}.employee_code`, "like", `%${search}%`)
        .orWhere(`${EMPLOYEE_TABLE}.full_name`, "like", `%${search}%`);
    });
  }

  if (officeCodeFilter) {
    query.andWhere((builder) => {
      builder.where(
        `${EMPLOYEE_TABLE}.office_code`,
        "like",
        `%${officeCodeFilter}%`
      );
    });
  }

  if (divisionCodeFilter) {
    query.andWhere((builder) => {
      builder.where(
        `${DIVISION_TABLE}.division_code`,
        "like",
        `%${divisionCodeFilter}%`
      );
    });
  }

  if (positionCodeFilter) {
    query.andWhere((builder) => {
      builder.where(
        `${POSITION_TABLE}.position_code`,
        "like",
        `%${positionCodeFilter}%`
      );
    });
  }

  return query.limit(limit).offset(offset).orderBy("id", "asc");
};

/**
 * Get employee by ID.
 */
export const getMasterEmployeesById = async (
  id: number
): Promise<GetEmployeeById | null> =>
  await db(EMPLOYEE_TABLE)
    .select(
      `${EMPLOYEE_TABLE}.*`,

      // Office fields
      `${OFFICE_TABLE}.name as office_name`,

      // Position fields
      `${POSITION_TABLE}.position_code`,
      `${POSITION_TABLE}.name as position_name`,

      // Division fields
      `${DIVISION_TABLE}.division_code as division_code`,
      `${DIVISION_TABLE}.name as division_name`,

      // Department fields
      `${DEPARTMENT_TABLE}.department_code as department_code`,
      `${DEPARTMENT_TABLE}.name as department_name`
    )
    .leftJoin(
      `${POSITION_TABLE}`,
      `${EMPLOYEE_TABLE}.position_code`,
      `${POSITION_TABLE}.position_code`
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
    .leftJoin(
      `${OFFICE_TABLE}`,
      `${EMPLOYEE_TABLE}.office_code`,
      `${OFFICE_TABLE}.office_code`
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
      `${EMPLOYEE_TABLE}.*`,

      // Office fields
      `${OFFICE_TABLE}.name as office_name`,

      // Position fields
      `${POSITION_TABLE}.position_code`,
      `${POSITION_TABLE}.name as position_name`,

      // Division fields
      `${DIVISION_TABLE}.division_code as division_code`,
      `${DIVISION_TABLE}.name as division_name`,

      // Department fields
      `${DEPARTMENT_TABLE}.department_code as department_code`,
      `${DEPARTMENT_TABLE}.name as department_name`
    )
    .leftJoin(
      `${POSITION_TABLE}`,
      `${EMPLOYEE_TABLE}.position_code`,
      `${POSITION_TABLE}.position_code`
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
    .leftJoin(
      `${OFFICE_TABLE}`,
      `${EMPLOYEE_TABLE}.office_code`,
      `${OFFICE_TABLE}.office_code`
    )
    .where({ "master_employees.employee_code": code })
    .first();

/**
 * Get employee by user code.
 */
export const getMasterEmployeesByUserCode = async (
  userCode: string
): Promise<{ employee_code: string; office_code: string } | null> => {
  return await db(EMPLOYEE_TABLE)
    .select("employee_code", "office_code")
    .where({ user_code: userCode })
    .first();
};

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

/**
 * Get Total Current Employee
 */
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
