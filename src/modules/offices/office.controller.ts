import { Request, Response } from "express";
import { errorResponse, successResponse } from "@utils/response.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@constants/general.js";
import { appLogger } from "@utils/logger.js";
import { DatabaseError } from "@common/types/error.types.js";
import {
  addMasterOffice,
  editMasterOffice,
  getAllMasterOffices,
  getMasterOfficeById,
  removeMasterOffice,
  getAllOfficesOrganization,
} from "./office.model.js";
import {
  addMasterOfficeSchema,
  updateMasterOfficeSchema,
} from "./office.schemas.js";
import { OfficeRawWithParent, OfficeTree } from "./office.types.js";
/**
 * [GET] /master-offices - Fetch all Offices
 */
export const fetchAllMasterOffices = async (req: Request, res: Response) => {
  try {
    const offices = await getAllMasterOffices();

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Kantor berhasil didapatkan",
      offices,
      200,
      RESPONSE_DATA_KEYS.OFFICES
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching offices: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
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
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Kantor tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Kantor berhasil didapatkan",
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

    const { name, address, latitude, longitude, radius_meters } =
      validation.data;

    const newOffice = await addMasterOffice({
      name,
      address,
      latitude,
      longitude,
      radius_meters,
    });

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data kantor berhasil dibuat",
      newOffice,
      201,
      RESPONSE_DATA_KEYS.OFFICES
    );
  } catch (error) {
    const dbError = error as DatabaseError;

    if (dbError.code === "ER_DUP_ENTRY" || dbError.errno === 1062) {
      const errorMessage = dbError.sqlMessage || dbError.message;

      // Check for Duplicate Office Code (unlikely as it is auto-generated, but good safety)
      if (errorMessage && errorMessage.includes("office_code")) {
        appLogger.warn("Office creation failed: Duplicate code entry.");
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Gagal membuat kantor",
          400,
          [
            {
              field: "office_code",
              message: "Kode kantor generate error (duplikat).",
            },
          ]
        );
      }

      // If you added a UNIQUE constraint on 'name' in the database
      if (errorMessage && errorMessage.includes("name")) {
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Validasi gagal",
          400,
          [{ field: "name", message: "Nama kantor sudah terdaftar." }]
        );
      }
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
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID kantor tidak valid.",
        400
      );
    }

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

    const { name, address, latitude, longitude, radius_meters } =
      validation.data;

    const updatedOffice = await editMasterOffice({
      id,
      name,
      address,
      latitude,
      longitude,
      radius_meters,
    });

    if (!updatedOffice) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Kantor tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data kantor berhasil diperbarui",
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
export const destroyMasterOffice = async (req: Request, res: Response) => {
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

    const existing = await getMasterOfficeById(id);
    if (!existing) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Kantor tidak ditemukan",
        404
      );
    }

    await removeMasterOffice(existing.id);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data kantor berhasil dihapus",
      null,
      200
    );
  } catch (error) {
    const dbError = error as DatabaseError;

    // Constraint Check: Cannot delete office if employees are assigned to it
    if (
      dbError.code === "ER_ROW_IS_REFERENCED" ||
      dbError.errno === 1451 ||
      (dbError.message &&
        dbError.message.includes("foreign key constraint fails"))
    ) {
      appLogger.warn(
        `Failed to delete Office ID ${req.params.id} due to constraint.`
      );
      return errorResponse(
        res,
        API_STATUS.CONFLICT,
        "Tidak dapat menghapus kantor karena masih ada pegawai yang ditempatkan di sini.",
        409
      );
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
      // --- LOGIC PENGHAPUSAN ---
      // Kita pisahkan 'parent_office_code' dari sisa data lainnya (officeData)
      // Variabel 'parent_office_code' ini kita ambil tapi TIDAK kita pakai/return.
      const { parent_office_code, ...officeData } = item;

      return {
        ...officeData, // Kembalikan data sisa (id, name, dll) TANPA parent_office_code
        children: buildTreeRecursive(items, item.office_code),
      };
    }) as unknown as OfficeTree[];
  // "as unknown as..." digunakan untuk memaksa TS menerima tipe data baru
  // yang sudah tidak punya parent_office_code lagi.
};

// --- CONTROLLER BARU ---
export const fetchOrganizationTree = async (req: Request, res: Response) => {
  try {
    // 1. Panggil function model yang SUDAH BENAR namanya
    const rawOffices = await getAllOfficesOrganization();

    // 2. Susun jadi Tree
    const officeTree = buildTreeRecursive(rawOffices, null);

    // 3. Helper timestamp (Menggunakan Double Quotes agar ESLint tidak error)
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    // 4. Return Response format "00"
    res.status(200).json({
      status: "00",
      message: "Data Organisasi Kantor Berhasil Didapatkan",
      datetime: datetime,
      offices: officeTree,
    });
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching organization tree: ${dbError}`);

    // Format tanggal untuk error
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    res.status(500).json({
      status: "03",
      message: "Terjadi kesalahan pada server",
      datetime: datetime,
    });
  }
};
