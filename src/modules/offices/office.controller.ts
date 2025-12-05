import { Request, Response } from "express";
import { errorResponse } from "@utils/response.js";
import { API_STATUS } from "@constants/general.js";
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
  hasChildOffices, // Pastikan ini ada di office.model.ts Anda
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
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    if (!office) {
      return res.status(404).json({
        status: "03",
        message: "Data Kantor tidak ditemukan",
        datetime: datetime,
      });
    }

    return res.status(200).json({
      status: "00",
      message: "Data Kantor berhasil didapatkan",
      datetime: datetime,
      offices: office,
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
 * [GET] /master-offices/code/:office_code - Fetch Office by Code
 */
export const fetchMasterOfficeByCode = async (req: Request, res: Response) => {
  try {
    const { office_code } = req.params;
    const office = await getMasterOfficeByCode(office_code);

    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    if (!office) {
      return res.status(404).json({
        status: "03",
        message: "Kantor tidak ditemukan",
        datetime: datetime,
      });
    }

    return res.status(200).json({
      status: "00",
      message: "Data Kantor Berhasil Didapatkan",
      datetime: datetime,
      offices: office,
    });
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
export const createMasterOffice = async (req: Request, res: Response) => {
  try {
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

    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    return res.status(201).json({
      status: "00",
      message: "Data Kantor Berhasil Diperbarui",
      datetime: datetime,
      offices: newOffice,
    });
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
export const updateMasterOffice = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
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
        validation.error.errors.map((err: any) => ({
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

    // --- LOGIKA PENGECEKAN CIRCULAR REFERENCE ---
    if (validation.data.parent_office_code) {
      const currentOffice = await getMasterOfficeById(id);

      if (
        currentOffice &&
        validation.data.parent_office_code === currentOffice.office_code
      ) {
        return errorResponse(
          res,
          "99",
          "Tidak dapat membuat referensi melingkar dalam organisasi",
          400
        );
      }
    }
    // --------------------------------------------

    // 2. Lakukan Update ke Database
    const updatedOffice = await editMasterOffice({
      id,
      ...validation.data,
    });

    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    // 3. Handle 404 Not Found (Status "03")
    if (!updatedOffice) {
      return res.status(404).json({
        status: "03",
        message: "Kantor tidak ditemukan",
        datetime: datetime,
      });
    }

    // 4. Handle Success 200 OK (Status "00")
    return res.status(200).json({
      status: "00",
      message: "Data Kantor Berhasil Diperbarui",
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
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(res, API_STATUS.BAD_REQUEST, "ID tidak valid.", 400);
    }

    // 1. Cek apakah data ada?
    const existing = await getMasterOfficeById(id);
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    if (!existing) {
      // 404 Not Found -> Status "04"
      return res.status(404).json({
        status: "04",
        message: "Kantor tidak ditemukan",
        datetime: datetime,
      });
    }

    // 2. Cek Logika: Apakah punya kantor anak (Sub-office)?
    // Pastikan hasChildOffices sudah di-import dari office.model.ts
    const hasChildren = await hasChildOffices(existing.office_code);
    if (hasChildren) {
      // 409 Conflict -> Status "05"
      return res.status(409).json({
        status: "05",
        message:
          "Tidak dapat menghapus kantor yang memiliki kantor anak atau karyawan terasosiasi.",
        datetime: datetime,
      });
    }

    // 3. Proses Delete
    await removeMasterOffice(existing.id);

    // 4. Sukses -> Status "00"
    return res.status(200).json({
      status: "00",
      message: "Data Kantor Berhasil Dihapus",
      datetime: datetime,
    });
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
