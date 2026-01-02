import { Request, Response } from "express";
import { errorResponse, successResponse } from "@utils/response.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@constants/general.js";
import { appLogger } from "@utils/logger.js";
import { DatabaseError } from "@apptypes/error.types.js";
import {
  getAllMasterEmployees,
  getMasterEmployeesByCode,
  getMasterEmployeesById,
  getMasterEmployeesByUserCode,
  removeMasterEmployees,
} from "./employee.model.js";
import {
  addMasterEmployeesSchema,
  updateMasterEmployeesSchema,
} from "./employee.schemas.js";
import { AuthenticatedRequest } from "@common/types/auth.type.js";
import { checkOfficeScope } from "@modules/offices/office.helper.js";
import {
  createEmployeeService,
  updateEmployeeService,
} from "./employee.service.js";
import {
  getEmployeeServiceErrorDetails,
  handleEmployeesDatabaseError,
  isEmployeeServiceError,
} from "./employee.helper.js";

/**
 * [GET] /master-employees - Fetch all Employees
 */
export const fetchAllMasterEmployees = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const search = (req.query.search as string) || "";

    // Filters
    const filterOffice = (req.query.office_code as string) || "";
    const filterDept = (req.query.department_code as string) || ""; // Added for completeness
    const filterDiv = (req.query.division_code as string) || "";
    const filterPos = (req.query.position_code as string) || "";
    const filterStatus = (req.query.employment_status as string) || "";

    const currentUser = req.user!;

    const { data, meta } = await getAllMasterEmployees(
      page,
      limit,
      currentUser.office_code || "",
      search,
      filterOffice,
      filterDept,
      filterDiv,
      filterPos,
      filterStatus
    );

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Karyawan berhasil didapatkan",
      data,
      200,
      RESPONSE_DATA_KEYS.EMPLOYEES,
      meta
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching employees: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /master-employees/:id - Fetch Employee by id
 */
export const fetchMasterEmployeesById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUser = req.user!;

    // Validate and cast the ID params
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID Karyawan tidak valid.",
        400
      );
    }

    const employees = await getMasterEmployeesById(id);

    if (!employees) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Karyawan tidak ditemukan",
        404
      );
    }

    const hasAccess = await checkOfficeScope(
      currentUser.office_code,
      employees.office_code
    );

    if (!hasAccess) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Data karyawan tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Karyawan berhasil didapatkan",
      employees,
      200,
      RESPONSE_DATA_KEYS.EMPLOYEES
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching employees:${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /master-employees/:id - Fetch Employee by code
 */
export const fetchMasterEmployeesByCode = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUser = req.user!;

    // Validate and cast the ID params
    const { employee_code } = req.params;

    const employees = await getMasterEmployeesByCode(employee_code);

    if (!employees) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Karyawan tidak ditemukan",
        404
      );
    }

    const hasAccess = await checkOfficeScope(
      currentUser.office_code,
      employees.office_code
    );

    if (!hasAccess) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Data karyawan tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Karyawan berhasil didapatkan",
      employees,
      200,
      RESPONSE_DATA_KEYS.EMPLOYEES
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching employees:${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /master-employees/:id - Fetch Employee by user code
 */
export const fetchMasterEmployeesByUserCode = async (
  req: Request,
  res: Response
) => {
  try {
    // Validate and cast the ID params
    const { user_code } = req.params;

    const employees = await getMasterEmployeesByUserCode(user_code);

    // const user = await getUserByCode(employees.user_code);

    if (!employees) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Karyawan tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Karyawan berhasil didapatkan",
      employees,
      200,
      RESPONSE_DATA_KEYS.EMPLOYEES
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching employees:${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [POST] /master-employees - Create a new Employee
 */
export const createMasterEmployees = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUser = req.user!;
    const validation = addMasterEmployeesSchema.safeParse(req.body);

    if (!validation.success) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Validasi gagal",
        400,
        validation.error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        }))
      );
    }

    const result = await createEmployeeService(
      currentUser.office_code,
      validation.data
    );

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data karyawan berhasil ditambahkan",
      result,
      201,
      RESPONSE_DATA_KEYS.EMPLOYEES
    );
  } catch (error) {
    if (isEmployeeServiceError(error)) {
      const { status, apiStatus, message } =
        getEmployeeServiceErrorDetails(error);

      return errorResponse(res, apiStatus, message, status);
    }

    const { status, apiStatus, message, errors } =
      handleEmployeesDatabaseError(error);

    return errorResponse(res, apiStatus, message, status, errors);
  }
};

/**
 * [PUT] /master-employees/:id - Edit a Employee
 */
export const updateMasterEmployees = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUser = req.user!;

    // Validate and cast the ID params
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID karyawan tidak valid.",
        400
      );
    }

    // Validate request body
    const validation = updateMasterEmployeesSchema.safeParse(req.body);
    if (!validation.success) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Validasi gagal",
        400,
        validation.error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        }))
      );
    }

    if (Object.keys(validation.data).length === 0) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Tidak ada data yang dikirim",
        400
      );
    }

    const result = await updateEmployeeService(
      id,
      currentUser.office_code,
      validation.data
    );

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data master karyawan berhasil diperbarui",
      result,
      200,
      RESPONSE_DATA_KEYS.EMPLOYEES
    );
  } catch (error) {
    if (isEmployeeServiceError(error)) {
      const { status, apiStatus, message } =
        getEmployeeServiceErrorDetails(error);

      return errorResponse(res, apiStatus, message, status);
    }

    const { status, apiStatus, message, errors } =
      handleEmployeesDatabaseError(error);

    return errorResponse(res, apiStatus, message, status, errors);
  }
};

/**
 * [DELETE] /master-employees/:id - Delete a Employee
 */
export const destroyMasterEmployees = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUser = req.user!;

    // Validate and cast the ID params
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID karyawan tidak valid.",
        400
      );
    }

    const existing = await getMasterEmployeesById(id);

    if (!existing) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Karyawan tidak ditemukan",
        404
      );
    }

    const hasAccess = await checkOfficeScope(
      currentUser.office_code,
      existing?.office_code
    );

    if (!hasAccess) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Anda tidak memiliki wewenang untuk menghapus karyawan ini",
        403
      );
    }

    await removeMasterEmployees(existing.id);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data master karyawan berhasil dihapus",
      null,
      200
    );
  } catch (error) {
    const dbError = error as DatabaseError;

    if (
      dbError.code === "ER_ROW_IS_REFERENCED" ||
      dbError.errno === 1451 ||
      (dbError.message &&
        dbError.message.includes("foreign key constraint fails"))
    ) {
      appLogger.warn(
        `Failed to delete employee ID ${req.params.id} due to constraint.`
      );
      return errorResponse(
        res,
        API_STATUS.CONFLICT,
        "Tidak dapat menghapus karyawan karena masih digunakan oleh User lain.",
        409
      );
    }

    // Catch-all for other server errors
    appLogger.error(`Error editing employees:${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
