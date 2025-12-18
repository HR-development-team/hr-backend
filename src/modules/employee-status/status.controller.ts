// status.controller.ts
import { Request, Response } from "express";
import { errorResponse, successResponse } from "@utils/response.js";
import { API_STATUS } from "@constants/general.js";
import { appLogger } from "@utils/logger.js";
import { DatabaseError } from "@apptypes/error.types.js";
import {
  getAllEmploymentStatuses,
  getEmploymentStatusById,
  getEmploymentStatusByCode,
  addEmploymentStatus,
  editEmploymentStatus,
  removeEmploymentStatus,
} from "./status.model.js";
import {
  addEmploymentStatusSchema,
  updateEmploymentStatusSchema,
} from "./status.schemas.js";

/**
 * [GET] /api/v1/employment_statuses - Fetch all employment statuses
 */
export const fetchAllEmploymentStatuses = async (
  req: Request,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;

    const statuses = await getAllEmploymentStatuses(page, limit);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data status karyawan berhasil didapatkan",
      statuses,
      200
      // RESPONSE_DATA_KEYS.EMPLOYMENT_STATUSES // Uncomment setelah ditambahkan ke constants
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching employment statuses: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /api/v1/employment_statuses/:id - Fetch employment status by ID
 */
export const fetchEmploymentStatusById = async (
  req: Request,
  res: Response
) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID status karyawan tidak valid.",
        400
      );
    }

    const status = await getEmploymentStatusById(id);

    if (!status) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data status karyawan tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data status karyawan berhasil didapatkan",
      status,
      200
      // RESPONSE_DATA_KEYS.EMPLOYMENT_STATUS // Uncomment setelah ditambahkan ke constants
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching employment status: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /api/v1/employment_statuses/code/:status_code - Fetch employment status by code
 */
export const fetchEmploymentStatusByCode = async (
  req: Request,
  res: Response
) => {
  try {
    const { status_code } = req.params;

    const status = await getEmploymentStatusByCode(status_code);

    if (!status) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data status karyawan tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data status karyawan berhasil didapatkan",
      status,
      200
      // RESPONSE_DATA_KEYS.EMPLOYMENT_STATUS // Uncomment setelah ditambahkan ke constants
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching employment status: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [POST] /api/v1/employment_statuses - Create a new employment status
 */
export const createEmploymentStatus = async (req: Request, res: Response) => {
  try {
    const validation = addEmploymentStatusSchema.safeParse(req.body);

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

    const statusData = validation.data;

    // status_code akan auto-generate di model (EPS0000001)
    const status = await addEmploymentStatus(statusData);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data status karyawan berhasil dibuat",
      status,
      201
      // RESPONSE_DATA_KEYS.EMPLOYMENT_STATUS // Uncomment setelah ditambahkan ke constants
    );
  } catch (error) {
    const dbError = error as DatabaseError;

    if (dbError.code === "ER_DUP_ENTRY" || dbError.errno === 1062) {
      const errorMessage = dbError.sqlMessage || dbError.message;

      if (errorMessage && errorMessage.includes("status_code")) {
        appLogger.warn(
          "Employment status creation failed: Duplicate status_code."
        );
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Validasi gagal",
          400,
          [
            {
              field: "name",
              message: "Terjadi kesalahan saat generate kode status. Silakan coba lagi.",
            },
          ]
        );
      }
    }

    appLogger.error(`Error creating employment status: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [PUT] /api/v1/employment_statuses/:id - Update an employment status
 */
export const updateEmploymentStatus = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID status karyawan tidak valid.",
        400
      );
    }

    const validation = updateEmploymentStatusSchema.safeParse(req.body);
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

    const statusData = validation.data;
    const status = await editEmploymentStatus({ id, ...statusData });

    if (!status) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data status karyawan tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data status karyawan berhasil diperbarui",
      status,
      200
      // RESPONSE_DATA_KEYS.EMPLOYMENT_STATUS // Uncomment setelah ditambahkan ke constants
    );
  } catch (error) {
    appLogger.error(`Error updating employment status: ${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [DELETE] /api/v1/employment_statuses/:id - Delete an employment status
 */
export const destroyEmploymentStatus = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID status karyawan tidak valid.",
        400
      );
    }

    const existing = await getEmploymentStatusById(id);

    if (!existing) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data status karyawan tidak ditemukan",
        404
      );
    }

    await removeEmploymentStatus(existing.id);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data status karyawan berhasil dihapus",
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
        `Failed to delete employment status ID ${req.params.id} due to constraint.`
      );
      return errorResponse(
        res,
        API_STATUS.CONFLICT,
        "Tidak dapat menghapus status karyawan karena masih digunakan oleh karyawan lain.",
        409
      );
    }

    appLogger.error(`Error deleting employment status: ${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};