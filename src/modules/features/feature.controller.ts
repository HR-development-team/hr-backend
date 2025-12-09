import { Request, Response } from "express";
import { errorResponse, successResponse } from "@utils/response.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@constants/general.js";
import { appLogger } from "src/common/utils/logger.js";
import { DatabaseError } from "@common/types/error.types.js";
import {
  addFeature,
  editFeature,
  getAllFeatures,
  getFeatureByCode,
  getFeatureById,
  removeFeature,
} from "./feature.model.js";
import { addFeaturesSchema, UpdateFeaturesSchema } from "./feature.schemas.js";

/**
 * [GET] /features - Fetch all features
 */
export const fetchAllFeatures = async (req: Request, res: Response) => {
  try {
    const features = await getAllFeatures();

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Feature berhasil di dapatkan",
      features,
      200,
      RESPONSE_DATA_KEYS.FEATURES
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching features:${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /features/:id - Fetch Feature by Id
 */
export const fetchFeaturesById = async (req: Request, res: Response) => {
  try {
    // Validate and cast the ID params
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID feature tidak valid.",
        400
      );
    }

    const features = await getFeatureById(id);

    if (!features) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Feature tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Feature berhasil didapatkan",
      features,
      200,
      RESPONSE_DATA_KEYS.FEATURES
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching features:${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /features/code/:code - Fetch Feature by code
 */
export const fetchFeaturesByCode = async (req: Request, res: Response) => {
  try {
    // Validate and cast the code params
    const code: string = req.params.code;

    const features = await getFeatureByCode(code);

    if (!features) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Feature tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Feature berhasil didapatkan",
      features,
      200,
      RESPONSE_DATA_KEYS.FEATURES
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching features:${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [POST] /features - Create a new Feature
 */
export const createFeatures = async (req: Request, res: Response) => {
  try {
    const validation = addFeaturesSchema.safeParse(req.body);

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

    const { name, description } = validation.data;
    const features = await addFeature({
      name,
      description,
    });

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data feature berhasil dibuat",
      features,
      201,
      RESPONSE_DATA_KEYS.FEATURES
    );
  } catch (error) {
    const dbError = error as DatabaseError;

    if (dbError.code === "ER_DUP_ENTRY" || dbError.errno === 1062) {
      const errorMessage = dbError.sqlMessage || dbError.message;

      // 1. Check for Duplicate Feature CODE
      if (
        errorMessage &&
        (errorMessage.includes("feature_code") ||
          errorMessage.includes("uni_feature_code"))
      ) {
        appLogger.warn(
          "Feature creation failed: Duplicate feature code entry."
        );
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Validasi gagal",
          400,
          [
            {
              field: "feature_code",
              message: "Kode feature yang dimasukkan sudah ada.",
            },
          ]
        );
      }

      if (
        errorMessage &&
        (errorMessage.includes("name") || errorMessage.includes("uni_name"))
      ) {
        appLogger.warn("Feature creation failed: Duplicate name entry.");
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Validasi gagal",
          400,
          [
            {
              field: "name",
              message: "Nama feature yang dimasukkan sudah ada.",
            },
          ]
        );
      }
    }

    appLogger.error(`Error creating features:${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [PUT] /features/:id - Edit a Feature
 */
export const updateFeatures = async (req: Request, res: Response) => {
  try {
    // Validate and cast the ID params
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID feature tidak valid.",
        400
      );
    }

    // Validate request body
    const validation = UpdateFeaturesSchema.safeParse(req.body);
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
    const { name, description } = validatedData;

    const features = await editFeature({
      id,
      name,
      description,
    });

    // Validate feature not found
    if (!features) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Feature tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data feature berhasil diperbarui",
      features,
      200,
      RESPONSE_DATA_KEYS.FEATURES
    );
  } catch (error) {
    appLogger.error(`Error editing features:${error}`);

    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [DELETE] /features/:id - Delete a Feature
 */
export const destroyFeature = async (req: Request, res: Response) => {
  try {
    // Validate and cast the ID params
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID Feature tidak valid.",
        400
      );
    }

    const existing = await getFeatureById(id);

    if (!existing) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Feature tidak ditemukan",
        404
      );
    }

    await removeFeature(existing.id);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Feature berhasil dihapus",
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
        `Failed to delete feature ID ${req.params.id} due to constraint.`
      );
      return errorResponse(
        res,
        API_STATUS.CONFLICT,
        "Tidak dapat menghapus Feature karena masih digunakan oleh pegawai lain.",
        409
      );
    }

    if (dbError.code === "ER_DUP_ENTRY" || dbError.errno === 1062) {
      const errorMessage = dbError.sqlMessage || dbError.message;

      // 1. Check for Duplicate Feature CODE
      if (
        errorMessage &&
        (errorMessage.includes("feature_code") ||
          errorMessage.includes("uni_feature_code"))
      ) {
        appLogger.warn(
          "Feature creation failed: Duplicate feature code entry."
        );
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Kode Feature yang dimasukkan sudah ada. Gunakan kode lain.",
          400
        );
      }
    }

    // Catch-all for other server errors
    appLogger.error(`Error editing features:${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
