import { Response } from "express";
import { errorResponse, successResponse } from "@utils/response.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@constants/general.js";
import { appLogger } from "@utils/logger.js";
import { DatabaseError } from "@apptypes/error.types.js";
import {
  addMasterDivisions,
  editMasterDivisions,
  getAllMasterDivision,
  getMasterDivisionsByCode,
  getMasterDivisionsById,
  removeMasterDivision,
} from "./division.model.js";
import {
  addMasterDivisionsSchema,
  updateMasterDivisionsSchema,
} from "./division.schemas.js";
import { AuthenticatedRequest } from "@common/types/auth.type.js";
import { checkOfficeScope } from "@modules/offices/office.helper.js";
import { getMasterDepartmentByCode } from "@modules/departments/department.model.js";
import { isDivisionNameExist } from "./division.helper.js";
import { isDuplicate } from "@common/utils/duplicateChecker.js";
import { db } from "@database/connection.js";
import { DIVISION_TABLE } from "@common/constants/database.js";

/**
 * [GET] /master-divisions - Fetch all Divisions
 */
export const fetchAllMasterDivisions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const search = (req.query.search as string) || "";

    // Filters
    const filterDept = (req.query.department_code as string) || "";
    const filterOffice = (req.query.office_code as string) || ""; // Added Office Filter

    const currentUser = req.user!;

    const { data, meta } = await getAllMasterDivision(
      page,
      limit,
      currentUser.office_code,
      search,
      filterDept,
      filterOffice // Pass to service
    );

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Divisi berhasil didapatkan",
      data,
      200,
      RESPONSE_DATA_KEYS.DIVISIONS,
      meta // Return meta
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching divisions: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /master-divisions/:id - Fetch Division by id
 */
export const fetchMasterDivisionsById = async (
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
        "ID divisi tidak valid.",
        400
      );
    }

    const divisions = await getMasterDivisionsById(id);

    if (!divisions) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Divisi tidak ditemukan",
        404
      );
    }

    const hasAccess = await checkOfficeScope(
      currentUser.office_code,
      divisions.office_code
    );

    if (!hasAccess) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Anda tidak memiliki wewenang untuk melihat divisi ini",
        403
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Divisi berhasil didapatkan",
      divisions,
      200,
      RESPONSE_DATA_KEYS.DIVISIONS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching division by id: ${dbError}`);

    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

export const fetchMasterDivisionByCode = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { division_code } = req.params;
    const division = await getMasterDivisionsByCode(division_code);

    const currentUser = req.user!;

    if (!division) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Divisi tidak ditemukan",
        404
      );
    }

    const hasAccess = await checkOfficeScope(
      currentUser.office_code,
      division.office_code
    );

    if (!hasAccess) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Anda tidak memiliki akses untuk melihat divisi ini",
        403
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Divisi Berhasil Didapatkan",
      division,
      200,
      RESPONSE_DATA_KEYS.DIVISIONS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching division by code: ${dbError}`);

    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [POST] /master-divisions - Create a new Division
 */
export const createMasterDivisions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUser = req.user!;
    const parentDepartementCode = req.body.department_code;

    const parentDepartment = await getMasterDepartmentByCode(
      parentDepartementCode
    );

    if (!parentDepartementCode) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Departemen induk tidak ditemukan",
        404
      );
    }

    const isAllowed = await checkOfficeScope(
      currentUser.office_code,
      parentDepartment.office_code
    );

    if (!isAllowed) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Anda tidak memiliki akses ke departemen ini",
        403
      );
    }

    const validation = addMasterDivisionsSchema.safeParse(req.body);

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

    const { name, department_code, description } = validation.data;

    const existingName = await isDivisionNameExist(department_code, name);

    if (existingName) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Nama divisi sudah ada di departemen ini",
        400
      );
    }

    const masterDivisions = await addMasterDivisions({
      name,
      department_code,
      description,
    });

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data master divisi berhasil dibuat",
      masterDivisions,
      201,
      RESPONSE_DATA_KEYS.DIVISIONS
    );
  } catch (error) {
    const dbError = error as DatabaseError;

    if (dbError.code === "ER_DUP_ENTRY" || dbError.errno === 1062) {
      const errorMessage = dbError.sqlMessage || dbError.message;

      // Check for Duplicate Division CODE
      if (
        errorMessage &&
        (errorMessage.includes("division_code") ||
          errorMessage.includes("uni_division_code"))
      ) {
        appLogger.warn(
          "Department creation failed: Duplicate division code entry."
        );
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Validasi gagal",
          400,
          [
            {
              field: "name",
              message: "Kode divisi yang dimasukkan sudah ada.",
            },
          ]
        );
      }
    }

    //  Check if the department code exist or not
    if (dbError.code === "ER_NO_REFERENCED_ROW_2" || dbError.errno === 1452) {
      appLogger.warn(
        "Division creation failed: department_code does not exist."
      );

      return errorResponse(res, API_STATUS.BAD_REQUEST, "Validasi gagal", 400, [
        {
          field: "department_code",
          message: "Kode departemen tidak ditemukan.",
        },
      ]);
    }

    appLogger.error(`Error creating divisions:${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [PUT] /master-divisions/:id - Edit a Division
 */
export const updateMasterDivisions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // Validate and cast the ID params
    const id: number = parseInt(req.params.id, 10);
    const currentUser = req.user!;
    const parentDepartmentCode = req.body.department_code;

    const parentDepartment =
      await getMasterDepartmentByCode(parentDepartmentCode);

    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID divisi tidak valid.",
        400
      );
    }

    // Validate request body
    const validation = updateMasterDivisionsSchema.safeParse(req.body);
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

    const validatedData = validation.data;
    const { name, department_code, description } = validatedData;

    const oldDiv = await getMasterDivisionsById(id);

    if (!oldDiv) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data divisi tidak ditemukan",
        404
      );
    }

    if (department_code && department_code !== oldDiv.department_code) {
      const hasAccessToCurrent = checkOfficeScope(
        currentUser.office_code,
        parentDepartment.office_code
      );

      if (!hasAccessToCurrent) {
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Departemen tujuan tidak ditemukan atau diluar wewenang Anda",
          400
        );
      }
    }

    /**
     * cek duplikasi nama divisi dalam satu departemen
     */

    if (name || department_code) {
      const targetDept = department_code || oldDiv.department_code;
      const targetName = name || oldDiv.name;

      const criteria = {
        department_code: targetDept,
        name: targetName,
      };

      const duplicateCheck = await isDuplicate(
        db,
        DIVISION_TABLE,
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
              message: `Divisi '${targetName}' sudah digunakan di departemen ini`,
            },
          ]
        );
      }
    }

    /**
     * cek departemen jika user mengirimkan departement_code baru
     */
    if (department_code) {
      const deptExist = await getMasterDepartmentByCode(department_code);

      if (!deptExist) {
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Departemen tidak ditemukan",
          400
        );
      }
    }

    /**
     * lanjut ke database
     */
    const masterDivisions = await editMasterDivisions({
      id,
      name,
      department_code,
      description,
    });

    // Validate department not found
    if (!masterDivisions) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Divisi tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data master divisi berhasil diperbarui",
      masterDivisions,
      200,
      RESPONSE_DATA_KEYS.DIVISIONS
    );
  } catch (error) {
    const dbError = error as DatabaseError;

    //  Check if the department code exist or not
    if (dbError.code === "ER_NO_REFERENCED_ROW_2" || dbError.errno === 1452) {
      appLogger.warn(
        "Division creation failed: department_code does not exist."
      );

      return errorResponse(res, API_STATUS.BAD_REQUEST, "Validasi gagal", 400, [
        {
          field: "department_code",
          message: "Kode departemen tidak ditemukan.",
        },
      ]);
    }

    appLogger.error(`Error editing divisions:${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [DELETE] /master-divisions/:id - Delete a Division
 */
export const destroyMasterDivisions = async (
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
        "ID divisi tidak valid.",
        400
      );
    }

    // cek apakah data ada?
    const existing = (await getMasterDivisionsById(id)) || null;

    const parentDepartment = await getMasterDepartmentByCode(
      existing?.department_code || ""
    );

    if (!existing) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Divisi tidak ditemukan",
        404
      );
    }

    /**
     * jika data ada, apakah user memiliki akses
     */
    const hasAccess = await checkOfficeScope(
      currentUser.office_code,
      parentDepartment.office_code || ""
    );

    if (!hasAccess) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Anda tidak memiliki wewenang untuk menghapus divisi dari departemen ini",
        403
      );
    }

    await removeMasterDivision(existing.id);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data master departemen berhasil dihapus",
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
        `Failed to delete department ID ${req.params.id} due to constraint.`
      );
      return errorResponse(
        res,
        API_STATUS.CONFLICT,
        "Tidak dapat menghapus divisi karena masih digunakan oleh Posisi lain.",
        409
      );
    }

    // Catch-all for other server errors
    appLogger.error(`Error editing divisions:${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
