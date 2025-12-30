import { Request, Response } from "express";
import {
  addHolidays,
  editHolidays,
  getAllHolidays,
  getHolidayById,
  removeHolidays,
} from "./holidays.model.js";
import { errorResponse, successResponse } from "@common/utils/response.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@common/constants/general.js";
import { addHolidaysSchema, updateHolidaysSchema } from "./holidays.schema.js";
import { isBefore } from "date-fns";
import {
  handleDatabaseError,
  toHolidayDetailResponse,
  toHolidaySimpleResponse,
} from "./holiday.helper.js";
import { db } from "@database/connection.js";

/**
 * [GET] /holidays = Fetch all Holidays
 */
export const fetchAllHolidays = async (req: Request, res: Response) => {
  try {
    const officeCode = req.query.office_code as string | "";

    const holiday = await getAllHolidays(officeCode);

    const responseData = holiday.map(toHolidaySimpleResponse);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data hari libur berhasil didapatkan",
      responseData,
      200,
      RESPONSE_DATA_KEYS.HOLIDAYS
    );
  } catch (error) {
    return handleDatabaseError(res, error, "fetching holidays");
  }
};

/**
 * [GET] /holidays/:id = Fetch Holiday by id
 */
export const fetchHolidaysById = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Id hari libur tidak valid",
        400
      );
    }

    const holiday = await getHolidayById(id);

    if (!holiday) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data hari libur tidak ditemukan",
        404
      );
    }

    const responseData = toHolidayDetailResponse(holiday);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data hari libur berhasil didapatkan",
      responseData,
      200,
      RESPONSE_DATA_KEYS.HOLIDAYS
    );
  } catch (error) {
    return handleDatabaseError(res, error, "fetching holiday by id");
  }
};

/**
 * [POST] /holidays - Create a new holiday
 */
export const createHolidays = async (req: Request, res: Response) => {
  const trx = await db.transaction();
  try {
    const validation = addHolidaysSchema.safeParse(req.body);

    if (!validation.success) {
      await trx.rollback();
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

    const holiday = await addHolidays(trx, validation.data);

    await trx.commit();

    const responseData = toHolidayDetailResponse(holiday);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data hari libur berhasil ditambahkan",
      responseData,
      200,
      RESPONSE_DATA_KEYS.HOLIDAYS
    );
  } catch (error) {
    await trx.rollback()
    return handleDatabaseError(res, error, "create holiday");
  }
};

/**
 * [PUT] /holidays/:id - Edit a holiday
 */
export const updateHolidays = async (req: Request, res: Response) => {
  const trx = await db.transaction();
  try {
    const id: number = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      await trx.rollback();
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID hari libur tidak valid",
        400
      );
    }

    const validation = updateHolidaysSchema.safeParse(req.body);

    if (!validation.success) {
      await trx.rollback()
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

    const oldHoliday = await getHolidayById(id);

    if (!oldHoliday) {
      await trx.rollback()
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data hari libur tidak ditemukan",
        404
      );
    }

    const updateHoliday = await editHolidays(trx, id, validation.data);

    await trx.commit();

    const responseData = toHolidayDetailResponse(updateHoliday);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data hari libur berhasil diperbarui",
      responseData,
      200,
      RESPONSE_DATA_KEYS.HOLIDAYS
    );
  } catch (error) {
    await trx.rollback()
    return handleDatabaseError(res, error, "update holiday");
  }
};

/**
 * [DELETE] /holidays/:id = Delete a holiday
 */
export const destroyHolidays = async (req: Request, res: Response) => {
  const trx = await db.transaction();
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      await trx.rollback();
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID hari libur tidak valid",
        400
      );
    }

    const existing = await getHolidayById(id);

    if (!existing) {
      await trx.rollback();
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Hari libur tidak ditemukan",
        404
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isBefore(existing.date, today)) {
      await trx.rollback();
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "DILARANG: Tidak dapat menghapus hari libur yang sudah berlalu",
        400
      );
    }

    await removeHolidays(trx, id);

    await trx.commit();

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Hari libur berhasil dihapus",
      null,
      200
    );
  } catch (error) {
    await trx.rollback();
    return handleDatabaseError(res, error, "delete holiday");
  }
};
