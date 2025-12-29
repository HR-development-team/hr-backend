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
  GetAllEmployeeResponse,
  UpdateEmployee,
  Employee,
  GetEmployeeById,
  UpdateEmployeeByCode,
} from "./employee.types.js";
import { generateEmployeeCode } from "./employee.helper.js";
import { officeHierarchyQuery } from "@modules/offices/office.helper.js";

export const getAllMasterEmployees = async (
  page: number,
  limit: number,
  userOfficeCode: string,
  search: string,
  filterOffice: string,
  filterDept: string,
  filterDiv: string,
  filterPos: string
): Promise<GetAllEmployeeResponse> => {
  const offset = (page - 1) * limit;

  // 1. Base Query (Joins only)
  const query = db(EMPLOYEE_TABLE)
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

  // 2. SECURITY SCOPE: User's Hierarchy
  if (userOfficeCode) {
    const allowedOfficesSubquery =
      officeHierarchyQuery(userOfficeCode).select("office_code");

    query.whereIn(`${EMPLOYEE_TABLE}.office_code`, allowedOfficesSubquery);
  }

  // 3. SEARCH (Name or Code)
  if (search) {
    query.andWhere((builder) => {
      builder
        .where(`${EMPLOYEE_TABLE}.employee_code`, "like", `%${search}%`)
        .orWhere(`${EMPLOYEE_TABLE}.full_name`, "like", `%${search}%`);
    });
  }

  // 4. FILTERS (Exact Match)
  if (filterOffice) {
    query.where(`${EMPLOYEE_TABLE}.office_code`, filterOffice);
  }

  if (filterDept) {
    // Note: Employees don't usually have department_code directly,
    // so we filter on the joined Department table
    query.where(`${DEPARTMENT_TABLE}.department_code`, filterDept);
  }

  if (filterDiv) {
    // Note: Filter on the joined Division table (via Position)
    query.where(`${DIVISION_TABLE}.division_code`, filterDiv);
  }

  if (filterPos) {
    query.where(`${EMPLOYEE_TABLE}.position_code`, filterPos);
  }

  // 5. Count Query (Clone strategy)
  const countQuery = query
    .clone()
    .clearSelect()
    .count(`${EMPLOYEE_TABLE}.id as total`)
    .first();

  // 6. Data Query
  const dataQuery = query
    .select(
      `${EMPLOYEE_TABLE}.*`,

      // Shift
      `${SHIFT_TABLE}.name as shift_name`,

      // Employment Status
      `${EMPLOYMENT_STATUS_TABLE}.status_code as employment_status_code`,
      `${EMPLOYMENT_STATUS_TABLE}.name as employment_status`,

      // Hierarchy Names
      `${OFFICE_TABLE}.name as office_name`,
      `${DEPARTMENT_TABLE}.department_code`,
      `${DEPARTMENT_TABLE}.name as department_name`,
      `${DIVISION_TABLE}.division_code`,
      `${DIVISION_TABLE}.name as division_name`,
      `${POSITION_TABLE}.position_code`,
      `${POSITION_TABLE}.name as position_name`
    )
    .orderBy(`${EMPLOYEE_TABLE}.id`, "asc") // Consistent ordering
    .limit(limit)
    .offset(offset);

  // 7. Execute in Parallel
  const [totalResult, data] = await Promise.all([countQuery, dataQuery]);

  const total = totalResult ? Number(totalResult.total) : 0;
  const totalPage = Math.ceil(total / limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      total_page: totalPage,
    },
  };
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
  id: number,
  data: UpdateEmployee
): Promise<Employee | null> => {
  const { ...updateData } = data;

  await db(EMPLOYEE_TABLE).where({ id }).update(updateData);
  return db(EMPLOYEE_TABLE).where({ id }).first();
};

/**
 * edit an existing position record by code.
 */
export const editMasterEmployeesByCode = async (
  employee_code: string,
  data: UpdateEmployeeByCode
): Promise<Employee | null> => {
  const { ...updateData } = data;

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
