import { Request, Response } from "express";
import { errorResponse, successResponse } from "@utils/response.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@constants/general.js";
import { appLogger } from "@utils/logger.js";
import { DatabaseError } from "@common/types/error.types.js";
import {
  addMasterOffice,
  editMasterOffice,
  getMasterOfficeById,
  removeMasterOffice,
  getPaginatedOffices,
  getAllOfficesOrganization,
  getMasterOfficeByCode,
  hasChildOffices,
  getOfficeReference, // Pastikan ini ada di office.model.ts Anda
} from "./office.model.js";
import {
  addMasterOfficeSchema,
  updateMasterOfficeSchema,
} from "./office.schemas.js";
import {
  GetOfficeById,
  OfficeRawWithParent,
  OfficeTree,
} from "./office.types.js";
import { AuthenticatedRequest } from "@common/types/auth.type.js";
import { checkOfficeScope, isOfficeExist } from "./office.helper.js";

// --- HELPER FUNCTION (Logic Pohon) ---
const buildTreeRecursive = (
  items: OfficeRawWithParent[],
  parentCode: string | null = null
): OfficeTree[] => {
  return items
    .filter((item) => {
      const itemParentCode = item.parent_office_code || null;
      return itemParentCode === parentCode;
    })
    .map((item) => {
      const { parent_office_code, ...officeData } = item;
      return {
        ...officeData,
        children: buildTreeRecursive(items, item.office_code),
      };
    }) as unknown as OfficeTree[];
};

/**
 * [GET] /master-offices - Fetch all Offices (With Pagination)
 */
export const fetchOfficeList = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const search = (req.query.search as string) || undefined;

    const currentUser = req.user!;

    const offices = await getPaginatedOffices(
      page,
      limit,
      currentUser.office_code,
      search
    );

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Kantor Berhasil Didapatkan",
      offices,
      200,
      RESPONSE_DATA_KEYS.OFFICES
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching office list: ${dbError}`);

    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

export const fetchOfficeReference = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUser = req.user!;

    const officeReference = await getOfficeReference(currentUser.office_code);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data referensi kantor berhasil didapatkan",
      officeReference,
      200,
      RESPONSE_DATA_KEYS.OFFICES
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching office reference: ${dbError}`);

    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /master-offices/organization - Fetch Organization Tree
 */
export const fetchOrganizationTree = async (req: Request, res: Response) => {
  try {
    const rawOffices = await getAllOfficesOrganization();
    const officeTree = buildTreeRecursive(rawOffices, null);

    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    return res.status(200).json({
      status: "00",
      message: "Data Organisasi Kantor Berhasil Didapatkan",
      datetime: datetime,
      offices: officeTree,
    });
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching organization tree: ${dbError}`);
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    return res.status(500).json({
      status: "03",
      message: "Terjadi kesalahan pada server",
      datetime: datetime,
    });
  }
};

/**
 * [GET] /master-offices/:id - Fetch Office by id
 */
export const fetchMasterOfficeById = async (
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
        "ID kantor tidak valid.",
        400
      );
    }

    const office = await getMasterOfficeById(id, currentUser.office_code);

    if (!office) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Kantor tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data kantor berhasil didapatkan",
      office,
      200,
      RESPONSE_DATA_KEYS.OFFICES
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching office by id: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /master-offices/code/:office_code - Fetch Office by Code
 */
export const fetchMasterOfficeByCode = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { office_code } = req.params;
    const currentUser = req.user!;
    const office = await getMasterOfficeByCode(
      office_code,
      currentUser.office_code
    );

    if (!office) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Kantor tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data kantor berhasil didapatkan",
      office,
      200,
      RESPONSE_DATA_KEYS.OFFICES
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching office by code: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [POST] /master-offices - Create a new Office
 */
export const createMasterOffice = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUser = req.user!;
    const parentOfficeCode = req.body.parent_office_code;

    if (parentOfficeCode) {
      const isAllowed = await checkOfficeScope(
        currentUser.office_code,
        parentOfficeCode
      );

      if (!isAllowed) {
        return errorResponse(
          res,
          API_STATUS.UNAUTHORIZED,
          "Anda tidak memiliki akses ke induk kantor tersebut",
          403
        );
      }
    }

    const validation = addMasterOfficeSchema.safeParse(req.body);

    if (!validation.success) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Validasi gagal",
        400,
        validation.error.errors.map((err: any) => ({
          field: err.path[0],
          message: err.message,
        }))
      );
    }

    const newOffice = await addMasterOffice(validation.data);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data kantor berhasil di tambahkan",
      newOffice,
      200,
      RESPONSE_DATA_KEYS.OFFICES
    );
  } catch (error) {
    const dbError = error as DatabaseError;

    // Handle Foreign Key Error (Parent Not Found)
    if (dbError.code === "ER_NO_REFERENCED_ROW_2" || dbError.errno === 1452) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Parent Office Code tidak valid (Kantor induk tidak ditemukan)",
        400
      );
    }

    appLogger.error(`Error creating office: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [PUT] /master-offices/:id - Edit an Office
 */
export const updateMasterOffice = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const currentUser = req.user!;

    if (isNaN(id)) {
      return errorResponse(res, API_STATUS.BAD_REQUEST, "ID tidak valid.", 400);
    }

    // 1. Validasi Input (Zod)
    const validation = updateMasterOfficeSchema.safeParse(req.body);
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

    // Cek data kosong
    if (Object.keys(validation.data).length === 0) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Tidak ada data yang dikirim",
        400
      );
    }

    const existingOffice: GetOfficeById = await isOfficeExist(id);

    if (!existingOffice) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Kantor tidak ditemukan",
        404
      );
    }

    const isTargetAllowed = await checkOfficeScope(
      currentUser.office_code,
      existingOffice.office_code
    );

    if (!isTargetAllowed) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Anda tidak memiliki akses untuk mengubah kantor ini",
        403
      );
    }

    const newParentCode = validation.data.parent_office_code;

    // --- LOGIKA PENGECEKAN CIRCULAR REFERENCE ---
    if (newParentCode && newParentCode !== existingOffice.parent_office_code) {
      if (newParentCode === existingOffice.office_code) {
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Tidak dapat membuat referensi melingkar dalam organisasi",
          400
        );
      }

      const isNewParentAllowed = await checkOfficeScope(
        currentUser.office_code,
        newParentCode
      );

      if (!isNewParentAllowed) {
        return errorResponse(
          res,
          API_STATUS.UNAUTHORIZED,
          "Induk kantor baru diluar wewenang Anda",
          403
        );
      }
    }

    // --------------------------------------------

    // 2. Lakukan Update ke Database
    const updatedOffice = await editMasterOffice({
      id,
      ...validation.data,
    });

    // 3. Handle 404 Not Found (Status "03")
    if (!updatedOffice) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Kantor tidak ditemukan",
        404
      );
    }

    // 4. Handle Success 200 OK (Status "00")
    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Kantor Berhasil Diperbarui",
      updatedOffice,
      200,
      RESPONSE_DATA_KEYS.OFFICES
    );
  } catch (error) {
    appLogger.error(`Error editing office: ${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [DELETE] /master-offices/:id - Delete an Office
 */
export const destroyMasterOffice = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const currentOffice = req.user!;

    if (isNaN(id)) {
      return errorResponse(res, API_STATUS.BAD_REQUEST, "ID tidak valid.", 400);
    }

    // 1. Cek apakah data ada?
    const existing = await getMasterOfficeById(id, currentOffice.office_code);

    if (!existing) {
      // 404 Not Found -> Status "04"
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Kantor tidak ditemukan",
        404
      );
    }

    const isAllowed = await checkOfficeScope(
      currentOffice.office_code!,
      existing.office_code
    );

    if (!isAllowed) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Anda tidak memiliki akses untuk menghapus kantor ini",
        403
      );
    }

    // 2. Cek Logika: Apakah punya kantor anak (Sub-office)?
    // Pastikan hasChildOffices sudah di-import dari office.model.ts
    const hasChildren = await hasChildOffices(existing.office_code);

    if (hasChildren) {
      // 409 Conflict -> Status "05"
      return errorResponse(
        res,
        API_STATUS.CONFLICT,
        "Tidak dapat menghapus kantor yang memiliki kantor anak atau karyawan terasosiasi",
        409
      );
    }

    // 3. Proses Delete
    await removeMasterOffice(existing.id);

    // 4. Sukses -> Status "00"
    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data kantor berhasil dihapus",
      null,
      200
    );
  } catch (error) {
    const dbError = error as DatabaseError;
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    // Cek Constraint Database (Misal: Ada karyawan yang terhubung)
    if (
      dbError.code === "ER_ROW_IS_REFERENCED" ||
      dbError.code === "ER_ROW_IS_REFERENCED_2" ||
      dbError.errno === 1451
    ) {
      return res.status(409).json({
        status: "05",
        message:
          "Tidak dapat menghapus kantor yang memiliki kantor anak atau karyawan terasosiasi.",
        datetime: datetime,
      });
    }

    appLogger.error(`Error deleting office: ${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
