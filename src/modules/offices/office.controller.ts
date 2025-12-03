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
  getPaginatedOffices, // Pastikan ini di-import
  getAllOfficesOrganization, // Pastikan ini di-import
} from "./office.model.js";
import {
  addMasterOfficeSchema,
  updateMasterOfficeSchema,
} from "./office.schemas.js";
import { OfficeRawWithParent, OfficeTree } from "./office.types.js";

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
      // Destructuring untuk membuang parent_office_code dari output
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
export const fetchOfficeList = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;

    const offices = await getPaginatedOffices(page, limit);

    // Format Tanggal Custom YYYYMMDDHHmmss
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    return res.status(200).json({
      status: "00",
      message: "Data Kantor Berhasil Didapatkan",
      datetime: datetime,
      offices: offices,
    });
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching office list: ${dbError}`);
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
 * [GET] /master-offices/organization - Fetch Organization Tree
 */
export const fetchOrganizationTree = async (req: Request, res: Response) => {
  try {
    // 1. Ambil data mentah
    const rawOffices = await getAllOfficesOrganization();

    // 2. Susun jadi Pohon
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
export const fetchMasterOfficeById = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID kantor tidak valid.",
        400
      );
    }

    const office = await getMasterOfficeById(id);

    if (!office) {
      const now = new Date();
      const datetime = now
        .toISOString()
        .replace(/[-T:Z.]/g, "")
        .slice(0, 14);
      return res.status(404).json({
        status: "03",
        message: "Data Kantor tidak ditemukan",
        datetime: datetime,
      });
    }

    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    return res.status(200).json({
      status: "00",
      message: "Data Kantor berhasil didapatkan",
      datetime: datetime,
      offices: office, // Spec minta single object di dalam key 'offices'
    });
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
 * [POST] /master-offices - Create a new Office
 */
export const createMasterOffice = async (req: Request, res: Response) => {
  try {
    const validation = addMasterOfficeSchema.safeParse(req.body);

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

    // Ambil semua field termasuk parent_office_code dan description
    const newOffice = await addMasterOffice(validation.data);

    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    return res.status(201).json({
      status: "00",
      message: "Data kantor berhasil dibuat",
      datetime: datetime,
      offices: newOffice,
    });
  } catch (error) {
    const dbError = error as DatabaseError;
    // ... Error handling duplicate code dll (bisa copy dari kode lama jika mau detail) ...
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
export const updateMasterOffice = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id))
      return errorResponse(res, API_STATUS.BAD_REQUEST, "ID tidak valid.", 400);

    const validation = updateMasterOfficeSchema.safeParse(req.body);
    if (!validation.success) {
      return errorResponse(res, API_STATUS.BAD_REQUEST, "Validasi gagal", 400);
    }

    const updatedOffice = await editMasterOffice({
      id,
      ...validation.data,
    });

    if (!updatedOffice) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Kantor tidak ditemukan",
        404
      );
    }

    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    return res.status(200).json({
      status: "00",
      message: "Data kantor berhasil diperbarui",
      datetime: datetime,
      offices: updatedOffice,
    });
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
export const destroyMasterOffice = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id))
      return errorResponse(res, API_STATUS.BAD_REQUEST, "ID tidak valid.", 400);

    const existing = await getMasterOfficeById(id);
    if (!existing)
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Kantor tidak ditemukan",
        404
      );

    await removeMasterOffice(existing.id);

    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    return res.status(200).json({
      status: "00",
      message: "Data kantor berhasil dihapus",
      datetime: datetime,
    });
  } catch (error) {
    // ... Error handling foreign key constraint ...
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
