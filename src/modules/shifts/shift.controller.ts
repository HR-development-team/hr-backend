import { Request, Response } from "express";
import { errorResponse, successResponse } from "@utils/response.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@constants/general.js";
import { appLogger } from "@utils/logger.js";
import { DatabaseError } from "@common/types/error.types.js";
import {
  addMasterShifts,
  editMasterShift,
  getAllMasterShifts,
  getMasterShiftOptions,
  getMasterShiftsById,
  removeMasterShift,
} from "./shift.model.js";
import {
  addMasterShiftSchema,
  updateMasterShiftSchema,
} from "./shift.schemas.js";
import { AuthenticatedRequest } from "@common/types/auth.type.js";

/**
 * [GET] /master-shifts - Fetch all Shifts
 */
export const fetchAllMasterShift = async (req: Request, res: Response) => {
  try {
    const shifts = await getAllMasterShifts();

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Shift berhasil didapatkan",
      shifts,
      200,
      RESPONSE_DATA_KEYS.SHIFTS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching shifts: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /master-shifts/:id - Fetch Shifts by id
 */
export const fetchMasterShiftById = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID shift tidak valid.",
        400
      );
    }

    const shift = await getMasterShiftsById(id);

    if (!shift) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Shift tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Shift berhasil didapatkan",
      shift,
      200,
      RESPONSE_DATA_KEYS.SHIFTS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching shift by id: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /master-shifts/options
 */
export const fetchMasterShiftOptions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUser = req.user!;
    const search = (req.query.search as string) || "";

    if (!currentUser.office_code) {
      return errorResponse(
        res,
        API_STATUS.UNAUTHORIZED,
        "Akun ini tidak terhubung ke data karyawan",
        401
      );
    }

    const options = await getMasterShiftOptions(
      currentUser.office_code,
      search
    );

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Berhasil mendapatkan data opsi shift",
      options,
      200,
      RESPONSE_DATA_KEYS.SHIFTS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching shifts: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [POST] /master-shifts - Create a new Shift
 */
export const createMasterShift = async (req: Request, res: Response) => {
  try {
    const validation = addMasterShiftSchema.safeParse(req.body);

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

    const {
      office_code,
      name,
      start_time,
      end_time,
      late_tolerance_minutes,
      check_in_limit_minutes,
      check_out_limit_minutes,
      is_overnight,
      work_days,
    } = validation.data;

    const newShift = await addMasterShifts({
      office_code,
      name,
      start_time,
      end_time,
      late_tolerance_minutes,
      check_in_limit_minutes,
      check_out_limit_minutes,
      is_overnight,
      work_days,
    });

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data shift berhasil dibuat",
      newShift,
      201,
      RESPONSE_DATA_KEYS.SHIFTS
    );
  } catch (error) {
    const dbError = error as DatabaseError;

    if (dbError.code === "ER_DUP_ENTRY" || dbError.errno === 1062) {
      const errorMessage = dbError.sqlMessage || dbError.message;

      // Check for Duplicate Shift Code (unlikely as it is auto-generated, but good safety)
      if (errorMessage && errorMessage.includes("shift_code")) {
        appLogger.warn("Shift creation failed: Duplicate code entry.");
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Gagal membuat shift",
          400,
          [
            {
              field: "shift_code",
              message: "Kode shift generate error (duplikat).",
            },
          ]
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
 * [PUT] /master-shifts/:id - Edit a Master Shift
 */
export const updateMasterShift = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID shift tidak valid.",
        400
      );
    }

    const validation = updateMasterShiftSchema.safeParse(req.body);

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

    const {
      office_code,
      name,
      start_time,
      end_time,
      is_overnight,
      late_tolerance_minutes,
      check_in_limit_minutes,
      check_out_limit_minutes,
      work_days,
    } = validation.data;

    const updatedShift = await editMasterShift({
      office_code,
      id,
      name,
      start_time,
      end_time,
      is_overnight,
      late_tolerance_minutes,
      check_in_limit_minutes,
      check_out_limit_minutes,
      work_days,
    });

    if (!updatedShift) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Shift tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data shift berhasil diperbarui",
      updatedShift,
      200,
      RESPONSE_DATA_KEYS.SHIFTS
    );
  } catch (error) {
    appLogger.error(`Error editing shift: ${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [DELETE] /master-shifts/:id - Delete a Shift
 */
export const destroyMasterShift = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID shift tidak valid.",
        400
      );
    }

    const existing = await getMasterShiftsById(id);
    if (!existing) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Shift tidak ditemukan",
        404
      );
    }

    await removeMasterShift(existing.id);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data shift berhasil dihapus",
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
        `Failed to delete Shift ID ${req.params.id} due to constraint.`
      );
      return errorResponse(
        res,
        API_STATUS.CONFLICT,
        "Tidak dapat menghapus shift karena sudah digunakan di data absensi atau data karyawan",
        409
      );
    }

    appLogger.error(`Error deleting shift: ${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
