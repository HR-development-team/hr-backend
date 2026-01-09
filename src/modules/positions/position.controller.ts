import { Request, Response } from "express";
import { appLogger } from "@utils/logger.js";
import {
  getPositionsByOffice,
  getAllPositions,
  getOfficeByCodeOrId,
  getPositionById,
  getPositionByCode,
  checkPositionExists,
  updatePosition,
  countEmployeesByPositionCode,
  countChildPositionsByCode,
  deletePositionById,
  getPositionOptions,
} from "./position.model.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@common/constants/general.js";
import { errorResponse, successResponse } from "@common/utils/response.js";
import { AuthenticatedRequest } from "@common/types/auth.type.js";
import { checkOfficeScope } from "@modules/offices/office.helper.js";
import { getMasterDivisionsByCode } from "@modules/divisions/division.model.js";
import { getMasterDepartmentByCode } from "@modules/departments/department.model.js";
import {
  addMasterPositionsSchema,
  createDepartmentPositionSchema,
  createDivisionPositionSchema,
  createOfficePositionSchema,
  updateMasterPositionsSchema,
} from "./position.schemas.js";
import { buildOrganizationTree } from "./position.helper.js";
import {
  createDepartmentPositionService,
  createDivisionPositionService,
  createGeneralPositionService,
  createOfficePositionService,
  ServiceError,
} from "./position.service.js";
import { DatabaseError } from "@common/types/error.types.js";

/**
 * 1. [GET] Organization Tree
 */
export const fetchOrganizationTree = async (req: Request, res: Response) => {
  try {
    const { office_id } = req.params;

    const office = await getOfficeByCodeOrId(office_id);

    if (!office) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Kantor tidak ditemukan",
        404
      );
    }

    const rawPositions = await getPositionsByOffice(office_id);
    const organizationTree = buildOrganizationTree(rawPositions);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      `Data Organisasi ${office.name} Berhasil Didapatkan`,
      organizationTree,
      200,
      RESPONSE_DATA_KEYS.POSITIONS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching organization tree: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * 2. [GET] Position List
 */
export const fetchPositionList = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    // Filters
    const filterOffice = (req.query.office_code as string) || "";
    const filterDept = (req.query.department_code as string) || "";
    const filterDiv = (req.query.division_code as string) || "";
    const filterScope = (req.query.scope as string) || "";

    const currentUser = req.user!;

    const { data, meta } = await getAllPositions(
      page,
      limit,
      currentUser.office_code,
      search,
      filterOffice,
      filterDept,
      filterDiv,
      filterScope
    );

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Jabatan Berhasil Didapatkan",
      data,
      200,
      RESPONSE_DATA_KEYS.POSITIONS,
      meta
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching positions list: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * 3. [GET] Position By ID
 */
export const fetchPositionById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUser = req.user!;

    const { id } = req.params;

    const positionId = Number(id);
    if (isNaN(positionId)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID Jabatan harus berupa angka",
        400
      );
    }

    const position = await getPositionById(positionId);

    if (!position) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Posisi tidak ditemukan",
        404
      );
    }

    const hasAccess = await checkOfficeScope(
      currentUser.office_code,
      position.office_code
    );

    if (!hasAccess) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Anda tidak memiliki wewenang untuk melihat jabatan ini",
        403
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Jabatan Berhasil Didapatkan",
      position,
      200,
      RESPONSE_DATA_KEYS.POSITIONS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching position by id: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * 4. [GET] Position By Code
 */
export const fetchPositionByCode = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUser = req.user!;

    const { position_code } = req.params;

    const position = await getPositionByCode(position_code);

    if (!position) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Posisi tidak ditemukan",
        404
      );
    }

    const hasAccess = await checkOfficeScope(
      currentUser.office_code,
      position.office_code
    );

    if (!hasAccess) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Anda tidak memiliki wewenang melihat jabatan ini",
        403
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Jabatan Berhasil Didapatkan",
      position,
      200,
      RESPONSE_DATA_KEYS.POSITIONS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching position by code: ${dbError}`);

    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /master-positions/options - Lightweight list for dropdowns
 */
export const fetchPositionOptions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const search = (req.query.search as string) || "";

    // Filters for Cascading Dropdowns
    const filterOffice = (req.query.office_code as string) || "";
    const filterDept = (req.query.department_code as string) || "";
    const filterDiv = (req.query.division_code as string) || "";

    const currentUser = req.user!;

    const options = await getPositionOptions(
      currentUser.office_code,
      search,
      filterOffice,
      filterDept,
      filterDiv
    );

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "List Jabatan berhasil didapatkan",
      options,
      200,
      RESPONSE_DATA_KEYS.POSITIONS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching position options: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * 5. [POST] Create New Position
 */
export const createMasterPositions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUser = req.user!;
    const validation = addMasterPositionsSchema.safeParse(req.body);

    if (!currentUser.office_code) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Akun ini tidak terhubung ke data kantor",
        403
      );
    }

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

    const newPosition = await createGeneralPositionService(
      currentUser.office_code,
      validation.data
    );

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Jabatan Berhasil Ditambahkan",
      newPosition,
      200,
      RESPONSE_DATA_KEYS.POSITIONS
    );
  } catch (error) {
    if (error instanceof ServiceError) {
      return errorResponse(
        res,
        API_STATUS.FAILED,
        error.message,
        error.statusCode
      );
    }

    const dbError = error as unknown;
    appLogger.error(`Error creating position: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * Create position for office leader
 */
export const createOfficePosition = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const validation = createOfficePositionSchema.safeParse(req.body);

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

    const result = await createOfficePositionService(validation.data);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Jabatan Office Berhasili Dibuat",
      result,
      201,
      RESPONSE_DATA_KEYS.POSITIONS
    );
  } catch (error) {
    if (error instanceof ServiceError) {
      return errorResponse(
        res,
        API_STATUS.FAILED,
        error.message,
        error.statusCode
      );
    }

    const dbError = error as DatabaseError;
    appLogger.error(`Error create office pos: ${dbError}`);

    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan server",
      500
    );
  }
};

/**
 * 2. Create DEPARTMENT Position
 */
export const createDepartmentPosition = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUser = req.user!;

    if (!currentUser.office_code) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Akun ini belum terhubung ke data kantor",
        403
      );
    }

    const validation = createDepartmentPositionSchema.safeParse(req.body);
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

    // Panggil Service (Kirim user info juga)
    const result = await createDepartmentPositionService(
      currentUser.office_code,
      validation.data
    );

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Jabatan Departemen Berhasil Dibuat",
      result,
      201,
      RESPONSE_DATA_KEYS.POSITIONS
    );
  } catch (error) {
    if (error instanceof ServiceError) {
      return errorResponse(
        res,
        API_STATUS.FAILED,
        error.message,
        error.statusCode
      );
    }

    const dbError = error as DatabaseError;
    appLogger.error(`Error create dept pos: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan server",
      500
    );
  }
};

/**
 * 3. Create DIVISION Position
 */
export const createDivisionPosition = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUser = req.user!;

    if (!currentUser.office_code) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Akun ini tidak terhubung ke data kantor",
        403
      );
    }

    const validation = createDivisionPositionSchema.safeParse(req.body);

    if (!validation.success) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Validasi gagal",
        400,
        validation.error.errors
      );
    }

    // Panggil Service
    const result = await createDivisionPositionService(
      currentUser.office_code,
      validation.data
    );

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Jabatan Divisi Berhasil Dibuat",
      result,
      201,
      RESPONSE_DATA_KEYS.POSITIONS
    );
  } catch (error) {
    if (error instanceof ServiceError) {
      return errorResponse(
        res,
        API_STATUS.FAILED,
        error.message,
        error.statusCode
      );
    }

    const dbError = error as DatabaseError;
    appLogger.error(`Error create div pos: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan server",
      500
    );
  }
};
// ==========================================
// 2. CONTROLLER UTAMA
// ==========================================
export const updateMasterPosition = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const currentUser = req.user!;

    if (isNaN(id)) {
      return errorResponse(res, API_STATUS.BAD_REQUEST, "ID tidak valid", 400);
    }

    const validation = updateMasterPositionsSchema.safeParse(req.body);

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

    // 1. Cek Existing Position
    const existingPosition = await getPositionById(id);
    if (!existingPosition) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Posisi tidak ditemukan",
        404
      );
    }

    // Ambil data dari body
    const {
      division_code,
      parent_position_code,
      name,
      base_salary,
      sort_order,
      description,
    } = validation.data;

    if (division_code) {
      const parentDivision = await getMasterDivisionsByCode(division_code);

      if (!parentDivision) {
        return errorResponse(
          res,
          API_STATUS.NOT_FOUND,
          "Divisi tidak ditemukan",
          404
        );
      }

      const parentDepartment = await getMasterDepartmentByCode(
        parentDivision.department_code
      );

      if (!parentDepartment) {
        return errorResponse(
          res,
          API_STATUS.NOT_FOUND,
          "Departemen induk tidak ditemukan",
          404
        );
      }

      const isTargetAllowed = await checkOfficeScope(
        currentUser.office_code,
        parentDepartment.office_code
      );

      if (!isTargetAllowed) {
        return errorResponse(
          res,
          API_STATUS.UNAUTHORIZED,
          "Anda tidak memiliki akses untuk mengubah jabatan ini",
          403
        );
      }
    }

    // 3. Validasi Parent (Logic Database)
    if (parent_position_code) {
      if (parent_position_code === existingPosition.position_code) {
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Tidak dapat membuat referensi melingkar dalam organisasi jabatan",
          400
        );
      }

      // 3b. Cek keberadaan parent
      const isParentValid = await checkPositionExists(parent_position_code);
      if (!isParentValid) {
        return errorResponse(
          res,
          API_STATUS.NOT_FOUND,
          `Kode induk jabatan '${parent_position_code}' tidak ditemukan`,
          404
        );
      }
    }

    // 4. Update Database
    const updateData = {
      ...(division_code !== undefined && { division_code }),
      ...(parent_position_code !== undefined && { parent_position_code }),
      ...(name !== undefined && { name }),
      ...(base_salary !== undefined && { base_salary }),
      ...(description !== undefined && { description }),
      ...(sort_order !== undefined && { sort_order }),
    };

    const updatedRaw = await updatePosition(id, updateData);

    // Format Response
    const responseData = {
      id: updatedRaw.id,
      position_code: updatedRaw.position_code,
      division_code: updatedRaw.division_code,
      parent_position_code: updatedRaw.parent_position_code,
      name: updatedRaw.name,
      base_salary: parseFloat(updatedRaw.base_salary),
      sort_order: updatedRaw.sort_order,
      description: updatedRaw.description,
      updated_at: updatedRaw.updated_at,
    };

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Jabatan Berhasil Diperbarui",
      responseData,
      200,
      RESPONSE_DATA_KEYS.POSITIONS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error updating position: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * 7. [DELETE] Delete Position
 * Gagal jika posisi ditempati karyawan atau punya posisi bawahan.
 */
export const destroyMasterPositions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUser = req.user!;

    const id = parseInt(req.params.id, 10);

    const positionId = Number(id);
    if (isNaN(positionId)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID Jabatan harus berupa angka",
        400
      );
    }

    const existingPosition = await getPositionById(id);
    if (!existingPosition) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Posisi tidak ditemukan",
        404
      );
    }

    const hasAccess = await checkOfficeScope(
      currentUser.office_code,
      existingPosition.office_code
    );

    if (!hasAccess) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Anda tidak memiliki wewenang untuk menghapus jabatan dari kantor/unit ini",
        403
      );
    }

    const positionCode = existingPosition.position_code;

    const employeeCount = await countEmployeesByPositionCode(positionCode);
    const childCount = await countChildPositionsByCode(positionCode);

    if (employeeCount > 0) {
      return errorResponse(
        res,
        API_STATUS.CONFLICT,
        "Gagal hapus: Masih ada karyawan yang menjabat posisi ini.",
        409
      );
    }

    if (childCount > 0) {
      return errorResponse(
        res,
        API_STATUS.CONFLICT,
        "Gagal hapus: Posisi ini masih menjadi atasan (Parent) bagi posisi lain.",
        409
      );
    }

    await deletePositionById(positionId);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Jabatan Berhasil Dihapus",
      null,
      200
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error deleting position: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
