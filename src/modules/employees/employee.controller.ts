import { Request, Response } from "express";
import { errorResponse, successResponse } from "@utils/response.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@constants/general.js";
import { appLogger } from "@utils/logger.js";
import { DatabaseError } from "@apptypes/error.types.js";
import {
  addMasterEmployees,
  editMasterEmployees,
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
    const officeCodeFilter = (req.query.office_code as string) || "";
    const division_code = (req.query.division_code as string) || "";
    const position_code = (req.query.position_code as string) || "";

    const currentUser = req.user!;

    const employees = await getAllMasterEmployees(
      page,
      limit,
      currentUser.office_code || "",
      search,
      officeCodeFilter,
      division_code,
      position_code
    );

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Karyawan berhasil di dapatkan",
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

    const parentOffice = validation.data.office_code;

    const hasAccess = await checkOfficeScope(
      currentUser.office_code,
      parentOffice
    );

    if (!hasAccess) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Anda tidak memiliki akses ke kantor ini",
        403
      );
    }

    const employeeData = validation.data;
    const masterEmployees = await addMasterEmployees(employeeData);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data master karyawan berhasil dibuat",
      masterEmployees,
      201,
      RESPONSE_DATA_KEYS.EMPLOYEES
    );
  } catch (error) {
    const dbError = error as DatabaseError;

    if (dbError.code === "ER_DUP_ENTRY" || dbError.errno === 1062) {
      const errorMessage = dbError.sqlMessage || dbError.message;
      const validationErrors = [];

      // --- Duplicate Employee CODE ---
      if (
        errorMessage &&
        (errorMessage.includes("employee_code") ||
          errorMessage.includes("uni_employee_code"))
      ) {
        validationErrors.push({
          field: "employee_code",
          message: "Kode karyawan yang dimasukkan sudah ada.",
        });
      }

      // Duplicate user code
      if (errorMessage && errorMessage.includes("user_code")) {
        validationErrors.push({
          field: "user_code",
          message:
            "Akun user yang dimasukkan sudah digunakan oleh karyawan lain",
        });
      }

      // --- Duplicate KTP Number ---
      if (errorMessage && errorMessage.includes("ktp_number")) {
        validationErrors.push({
          field: "ktp_number",
          message: "Nomor KTP yang dimasukkan sudah terdaftar.",
        });
      }

      // --- Duplicate BPJS Ketenagakerjaan ---
      if (errorMessage && errorMessage.includes("bpjs_ketenagakerjaan")) {
        validationErrors.push({
          field: "bpjs_ketenagakerjaan",
          message:
            "Nomor BPJS Ketenagakerjaan yang dimasukkan sudah terdaftar.",
        });
      }

      // --- Duplicate BPJS Kesehatan ---
      if (errorMessage && errorMessage.includes("bpjs_kesehatan")) {
        validationErrors.push({
          field: "bpjs_kesehatan",
          message: "Nomor BPJS Kesehatan yang dimasukkan sudah terdaftar.",
        });
      }

      // --- Duplicate NPWP ---
      if (errorMessage && errorMessage.includes("npwp")) {
        validationErrors.push({
          field: "npwp",
          message: "Nomor NPWP yang dimasukkan sudah terdaftar.",
        });
      }

      // --- Send Duplicate Entry Response if any unique field failed ---
      if (validationErrors.length > 0) {
        appLogger.warn(
          "Employee creation failed: Duplicate entry detected for unique field(s)."
        );
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Validasi gagal",
          400,
          validationErrors
        );
      }
    }

    //  Check if the position code exist or not
    if (dbError.code === "ER_NO_REFERENCED_ROW_2" || dbError.errno === 1452) {
      appLogger.warn("Employee creation failed: position_code does not exist.");

      return errorResponse(res, API_STATUS.BAD_REQUEST, "Validasi gagal", 400, [
        {
          field: "position_code",
          message: "Kode posisi tidak ditemukan.",
        },
      ]);
    }

    appLogger.error(`Error creating employees:${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
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

    console.log(
      "User Office Code:",
      currentUser.office_code,
      "| Tipe data user Office Code:",
      typeof currentUser.office_code
    );

    if (Object.keys(validation.data).length === 0) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Tidak ada data yang dikirim",
        400
      );
    }

    const existingEmployee = await getMasterEmployeesById(id);

    if (!existingEmployee) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Karyawan tidak ditemukan",
        404
      );
    }

    const parentOfficeCode =
      req.body.office_code || existingEmployee.office_code;

    const hasAccess = await checkOfficeScope(
      currentUser.office_code || "",
      parentOfficeCode
    );

    if (!hasAccess) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Anda tidak memiliki wewenang menaruh karyawan di kantor ini",
        403
      );
    }

    const employeeData = validation.data;

    const isTargetAllowed = await checkOfficeScope(
      currentUser.office_code,
      existingEmployee?.office_code
    );

    if (!isTargetAllowed) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Anda tidak memiliki akses untuk mengubah karyawan ini",
        403
      );
    }

    const masterEmployees = await editMasterEmployees({ id, ...employeeData });

    // Validate employee not found
    if (!masterEmployees) {
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
      "Data master karyawan berhasil diperbarui",
      masterEmployees,
      200,
      RESPONSE_DATA_KEYS.EMPLOYEES
    );
  } catch (error) {
    const dbError = error as DatabaseError;

    if (dbError.code === "ER_DUP_ENTRY" || dbError.errno === 1062) {
      const errorMessage = dbError.sqlMessage || dbError.message;
      const validationErrors = [];

      // --- Duplicate Employee CODE ---
      if (
        errorMessage &&
        (errorMessage.includes("employee_code") ||
          errorMessage.includes("uni_employee_code"))
      ) {
        validationErrors.push({
          field: "employee_code",
          message: "Kode karyawan yang dimasukkan sudah ada.",
        });
      }

      // Duplicate user code
      if (errorMessage && errorMessage.includes("user_code")) {
        validationErrors.push({
          field: "user_code",
          message:
            "Akun user yang dimasukkan sudah digunakan oleh karyawan lain",
        });
      }

      // --- Duplicate KTP Number ---
      if (errorMessage && errorMessage.includes("ktp_number")) {
        validationErrors.push({
          field: "ktp_number",
          message: "Nomor KTP yang dimasukkan sudah terdaftar.",
        });
      }

      // --- Duplicate BPJS Ketenagakerjaan ---
      if (errorMessage && errorMessage.includes("bpjs_ketenagakerjaan")) {
        validationErrors.push({
          field: "bpjs_ketenagakerjaan",
          message:
            "Nomor BPJS Ketenagakerjaan yang dimasukkan sudah terdaftar.",
        });
      }

      // --- Duplicate BPJS Kesehatan ---
      if (errorMessage && errorMessage.includes("bpjs_kesehatan")) {
        validationErrors.push({
          field: "bpjs_kesehatan",
          message: "Nomor BPJS Kesehatan yang dimasukkan sudah terdaftar.",
        });
      }

      // --- Duplicate NPWP ---
      if (errorMessage && errorMessage.includes("npwp")) {
        validationErrors.push({
          field: "npwp",
          message: "Nomor NPWP yang dimasukkan sudah terdaftar.",
        });
      }

      // --- Send Duplicate Entry Response if any unique field failed ---
      if (validationErrors.length > 0) {
        appLogger.warn(
          "Employee creation failed: Duplicate entry detected for unique field(s)."
        );
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Validasi gagal",
          400,
          validationErrors
        );
      }
    }

    //  Check if the position code exist or not
    if (dbError.code === "ER_NO_REFERENCED_ROW_2" || dbError.errno === 1452) {
      appLogger.warn("Employee creation failed: position_code does not exist.");

      return errorResponse(res, API_STATUS.BAD_REQUEST, "Validasi gagal", 400, [
        {
          field: "position_code",
          message: "Kode posisi tidak ditemukan.",
        },
      ]);
    }

    appLogger.error(`Error editing employees:${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
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
