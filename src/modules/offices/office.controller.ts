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
} from "./office.model.js";
import {
  addMasterOfficeSchema,
  updateMasterOfficeSchema,
} from "./office.schemas.js";
import { OfficeRawWithParent, OfficeTree } from "./office.types.js";

// Helper Pohon Rekursif
const buildTreeRecursive = (
  items: OfficeRawWithParent[],
  parentCode: string | null = null
): OfficeTree[] => {
  return items
    .filter((item) => (item.parent_office_code || null) === parentCode)
    .map((item) => {
      const { parent_office_code, ...officeData } = item;
      return {
        ...officeData,
        children: buildTreeRecursive(items, item.office_code),
      };
    }) as unknown as OfficeTree[];
};

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
      datetime,
      offices,
    });
  } catch (error) {
    appLogger.error(`Error fetching list: ${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

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
      datetime,
      offices: officeTree,
    });
  } catch (error) {
    appLogger.error(`Error fetching tree: ${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

export const fetchMasterOfficeById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id))
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID kantor tidak valid.",
        400
      );

    const office = await getMasterOfficeById(id);
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    if (!office)
      return res.status(404).json({
        status: "03",
        message: "Data Kantor tidak ditemukan",
        datetime,
      });
    return res.status(200).json({
      status: "00",
      message: "Data Kantor berhasil didapatkan",
      datetime,
      offices: office,
    });
  } catch (error) {
    appLogger.error(`Error fetching by ID: ${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

export const fetchMasterOfficeByCode = async (req: Request, res: Response) => {
  try {
    const { office_code } = req.params;
    const office = await getMasterOfficeByCode(office_code);
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    if (!office)
      return res
        .status(404)
        .json({ status: "03", message: "Kantor tidak ditemukan", datetime });
    return res.status(200).json({
      status: "00",
      message: "Data Kantor Berhasil Didapatkan",
      datetime,
      offices: office,
    });
  } catch (error) {
    appLogger.error(`Error fetching by Code: ${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

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
      datetime,
      offices: newOffice,
    });
  } catch (error) {
    const dbError = error as DatabaseError;
    if (dbError.code === "ER_NO_REFERENCED_ROW_2" || dbError.errno === 1452) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Parent Office Code tidak valid",
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

export const updateMasterOffice = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id))
      return errorResponse(res, API_STATUS.BAD_REQUEST, "ID tidak valid.", 400);

    const validation = updateMasterOfficeSchema.safeParse(req.body);
    if (!validation.success)
      return errorResponse(res, API_STATUS.BAD_REQUEST, "Validasi gagal", 400);

    const updatedOffice = await editMasterOffice({ id, ...validation.data });
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    if (!updatedOffice)
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Kantor tidak ditemukan",
        404
      );
    return res.status(200).json({
      status: "00",
      message: "Data kantor berhasil diperbarui",
      datetime,
      offices: updatedOffice,
    });
  } catch (error) {
    appLogger.error(`Error updating office: ${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

export const destroyMasterOffice = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
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
      datetime,
    });
  } catch (error) {
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
