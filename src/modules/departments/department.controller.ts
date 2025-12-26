import { Response } from "express";
import { errorResponse, successResponse } from "@utils/response.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@constants/general.js";
import { appLogger } from "src/common/utils/logger.js";
import { DatabaseError } from "@common/types/error.types.js";
import {
  addMasterDepartments,
  editMasterDepartments,
  getAllMasterDepartments,
  getMasterDepartmentsById,
  removeMasterDepartments,
  getMasterDepartmentByCode,
  getDepartmentOptions,
} from "./department.model.js";
import {
  addMasterDepartmentsSchema,
  updateMasterDepartmentsSchema,
} from "./department.schemas.js";
import { getMasterOfficeByCode } from "../offices/office.model.js";
import { AuthenticatedRequest } from "@common/types/auth.type.js";
import { checkOfficeScope } from "@modules/offices/office.helper.js";
import {
  getDepartmentsById,
  isDepartmentNameExist,
} from "./department.helper.js";
import { isDuplicate } from "@common/utils/duplicateChecker.js";
import { db } from "@database/connection.js";
import { DEPARTMENT_TABLE } from "@common/constants/database.js";

/**
 * [GET] /master-departments - Fetch all Departments
 */
export const fetchAllMasterDepartments = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const search = (req.query.search as string) || "";
    const filterOffice = (req.query.office_code as string) || "";

    const currentUser = req.user!;

    const { data, meta } = await getAllMasterDepartments(
      page,
      limit,
      currentUser.office_code,
      search,
      filterOffice
    );

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Departemen berhasil didapatkan",
      data,
      200,
      RESPONSE_DATA_KEYS.DEPARTMENTS,
      meta
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching departments: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /master-departments/:id - Fetch Department by id
 */
export const fetchMasterDepartmentsById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUser = req.user!;

    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID departemen tidak valid.",
        400
      );
    }

    const department = await getMasterDepartmentsById(id);

    if (!department) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Departemen tidak ditemukan",
        404
      );
    }

    const hasAccess = await checkOfficeScope(
      currentUser.office_code,
      department.office_code
    );

    if (!hasAccess) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Anda tidak memiliki akses untuk melihat departemen ini",
        403
      );
    }

    // Return 200 Sesuai Format

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Departemen Berhasil Didapatkan",
      department,
      200,
      RESPONSE_DATA_KEYS.DEPARTMENTS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching department by id: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /master-departments/options - Lightweight list for dropdowns
 */
export const fetchDepartmentOptions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const search = (req.query.search as string) || "";
    // Frontend can pass this to filter departments by a specific office
    const filterOffice = (req.query.office_code as string) || "";

    const currentUser = req.user!;

    const options = await getDepartmentOptions(
      currentUser.office_code,
      search,
      filterOffice
    );

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "List Departemen berhasil didapatkan",
      options,
      200,
      RESPONSE_DATA_KEYS.DEPARTMENTS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching department options: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /master-departments/code/:department_code - Fetch Department by Code
 */
export const fetchMasterDepartmentByCode = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { department_code } = req.params;
    const currentUser = req.user!;

    // Panggil Model
    const department = await getMasterDepartmentByCode(department_code);

    // Handle 404 (Tidak Ditemukan)
    if (!department) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Departemen tidak ditemukan",
        404
      );
    }

    const hasAccess = await checkOfficeScope(
      currentUser.office_code,
      department.office_code
    );

    if (!hasAccess) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Anda tidak memiliki akses untuk melihat divisi ini",
        403
      );
    }

    // Handle 200 (Sukses)
    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Departemen Berhasil Didapatkan",
      department,
      200,
      RESPONSE_DATA_KEYS.DEPARTMENTS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching department by code: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [POST] /master-departments - Create a new Department
 */
export const createMasterDepartments = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUser = req.user!;
    const parentOfficeCode = req.body.office_code;

    const isAllowed = checkOfficeScope(
      currentUser.office_code,
      parentOfficeCode
    );

    if (!isAllowed) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Anda tidak memiliki akses ke kantor ini",
        403
      );
    }

    const validation = addMasterDepartmentsSchema.safeParse(req.body);

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

    const { name, description, office_code } = validation.data;

    // 1. Cek Apakah Kantor Ada?
    const officeExists = await getMasterOfficeByCode(
      office_code,
      currentUser.office_code
    );

    if (!officeExists) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Kantor tidak ditemukan",
        404
      );
    }

    const existingName = await isDepartmentNameExist(parentOfficeCode, name);

    if (existingName) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Nama departemen sudah ada di kantor ini",
        400
      );
    }

    // 2. Simpan Data ke Database
    const newDepartment = await addMasterDepartments(
      {
        name,
        description,
        office_code,
      },
      office_code
    );

    // 3. [PENTING] Definisikan departmentData di sini!
    // Kita pisahkan created_at dan updated_at agar tidak ikut terkirim.
    // ID tetap ada di dalam departmentData.
    const { created_at, updated_at, ...departmentData } = newDepartment;

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Departemen Berhasil Ditambahkan",
      departmentData,
      201,
      RESPONSE_DATA_KEYS.DEPARTMENTS
    );
  } catch (error) {
    const dbError = error as DatabaseError;

    if (dbError.code === "ER_DUP_ENTRY" || dbError.errno === 1062) {
      const errorMessage = dbError.sqlMessage || dbError.message;
      if (
        errorMessage &&
        (errorMessage.includes("department_code") ||
          errorMessage.includes("uni_department_code"))
      ) {
        appLogger.warn(
          "Department creation failed: Duplicate department code."
        );
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Validasi gagal",
          400,
          [
            {
              field: "name",
              message: "Kode departemen yang dimasukkan sudah ada.",
            },
          ]
        );
      }
    }

    appLogger.error(`Error creating departments: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
/**
 * [PUT] /master-departments/:id - Edit a Department
 */
export const updateMasterDepartments = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    const currentUser = req.user!;

    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID departemen tidak valid.",
        400
      );
    }

    // 1. Validasi Input Dasar
    const validation = updateMasterDepartmentsSchema.safeParse(req.body);
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

    const { name, description, office_code } = validation.data;

    const oldDept = await getDepartmentsById(id);

    if (!oldDept) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data departemen tidak ditemukan",
        404
      );
    }

    if (office_code && office_code !== oldDept.office_code) {
      const hasAccessToCurrent = await checkOfficeScope(
        currentUser.office_code,
        oldDept.office_code
      );

      if (!hasAccessToCurrent) {
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Kantor tujuan tidak ditemukan atau diluar wewenang Anda",
          400
        );
      }
    }

    /**
     * cek duplikasi nama departemen dalam satu kantor
     */

    if (name || office_code) {
      const targetOffice = office_code || oldDept.office_code;
      const targetName = name || oldDept.name;

      const criteria = {
        office_code: targetOffice,
        name: targetName,
      };

      const duplicateCheck = await isDuplicate(
        db,
        DEPARTMENT_TABLE,
        criteria,
        id,
        "id"
      );

      if (duplicateCheck) {
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Validasi Gagal",
          400,
          [
            {
              field: "Name",
              message: `Departemen '${targetName}' sudah digunakan di kantor ini`,
            },
          ]
        );
      }
    }

    // 2. [PERBAIKAN UTAMA] Pasang Satpam (Cek Kantor) Disini!
    // Kita hanya cek jika user mengirimkan office_code baru
    if (office_code) {
      const officeExists = await getMasterOfficeByCode(
        office_code,
        currentUser.office_code
      );

      if (!officeExists) {
        // Return Error Status 99 (Kantor Tidak Ditemukan)
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Kantor tidak ditemukan",
          400
        );
      }
    }

    // 3. Lanjut Update ke Database (Aman)
    const updatedDepartment = await editMasterDepartments({
      id,
      name,
      description,
      office_code,
    });

    if (!updatedDepartment) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Departemen tidak ditemukan",
        404
      );
    }

    // 4. Format Output
    const { created_at, updated_at, ...cleanDepartment } = updatedDepartment;

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Departemen Berhasil Diperbarui",
      cleanDepartment,
      200,
      RESPONSE_DATA_KEYS.DEPARTMENTS
    );
  } catch (error) {
    appLogger.error(`Error editing departments: ${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
/**
 * [DELETE] /master-departments/:id - Delete a Department
 */
export const destroyMasterDepartments = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUser = req.user!;

    // 1. Validasi ID
    const id: number = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID departemen tidak valid.",
        400
      );
    }

    // 2. Cek Apakah Data Ada?
    const existing = (await getMasterDepartmentsById(id)) || null;

    if (!existing) {
      // Return 404 Not Found (Sesuai Request: Status "04")
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Departemen tidak ditemukan",
        404
      );
    }

    /**
     * jika data ada, apakah user memiliki akses?
     */
    const hasAccess = await checkOfficeScope(
      currentUser.office_code,
      existing?.office_code || null
    );

    if (!hasAccess) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Anda tidak memiliki wewenang untuk menghapus departemen dari kantor ini",
        403
      );
    }

    // 3. Eksekusi Hapus
    await removeMasterDepartments(existing.id);

    // Return 200 OK (Sesuai Request: Status "00")
    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Departemen Berhasil Dihapus",
      null,
      200
    );
  } catch (error) {
    const dbError = error as DatabaseError;

    // 4. Handle Foreign Key Constraint (Konflik)
    // Error 1451 / ER_ROW_IS_REFERENCED artinya departemen ini dipakai di tabel lain (misal: employees)
    if (
      dbError.code === "ER_ROW_IS_REFERENCED" ||
      dbError.code === "ER_ROW_IS_REFERENCED_2" ||
      dbError.errno === 1451
    ) {
      // Return 409 Conflict (Sesuai Request: Status "05")
      return errorResponse(
        res,
        API_STATUS.CONFLICT,
        "Tidak dapat menghapus departemen yang masih memiliki karyawan terasosiasi",
        409
      );
    }

    // Error Server Lainnya
    appLogger.error(`Error deleting department: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
