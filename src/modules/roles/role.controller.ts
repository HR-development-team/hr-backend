import { Request, Response } from "express";
import { errorResponse, successResponse } from "@utils/response.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@constants/general.js";
import { appLogger } from "src/common/utils/logger.js";
import { DatabaseError } from "@common/types/error.types.js";
import {
  addRole,
  editRole,
  getAllRoles,
  getRoleByCode,
  getRoleById,
  getRoleOptions,
  removeRole,
} from "./role.model.js";
import { addRolesSchema, UpdateRoleSchema } from "./role.schemas.js";

/**
 * [GET] /roles - Fetch all roles
 */
export const fetchAllRoles = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const search = (req.query.search as string) || "";

    const { data, meta } = await getAllRoles(page, limit, search);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Role berhasil didapatkan",
      data,
      200,
      RESPONSE_DATA_KEYS.ROLES,
      meta
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching roles: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /roles/options - Lightweight list for dropdowns
 */
export const fetchRoleOptions = async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string) || "";

    const options = await getRoleOptions(search);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "List Role berhasil didapatkan",
      options,
      200,
      RESPONSE_DATA_KEYS.ROLES
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching role options: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /roles/:id - Fetch Role by Id
 */
export const fetchRolesById = async (req: Request, res: Response) => {
  try {
    // Validate and cast the ID params
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID role tidak valid.",
        400
      );
    }

    const roles = await getRoleById(id);

    if (!roles) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Role tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Role berhasil didapatkan",
      roles,
      200,
      RESPONSE_DATA_KEYS.ROLES
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching roles:${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /roles/code/:code - Fetch Role by code
 */
export const fetchRolesByCode = async (req: Request, res: Response) => {
  try {
    // Validate and cast the code params
    const code: string = req.params.code;

    const roles = await getRoleByCode(code);

    if (!roles) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Role tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Role berhasil didapatkan",
      roles,
      200,
      RESPONSE_DATA_KEYS.ROLES
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching roles:${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [POST] /roles - Create a new Role
 */
export const createRoles = async (req: Request, res: Response) => {
  try {
    const validation = addRolesSchema.safeParse(req.body);

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
    const roles = await addRole({
      name,
      description,
    });

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data role berhasil dibuat",
      roles,
      201,
      RESPONSE_DATA_KEYS.ROLES
    );
  } catch (error) {
    const dbError = error as DatabaseError;

    if (dbError.code === "ER_DUP_ENTRY" || dbError.errno === 1062) {
      const errorMessage = dbError.sqlMessage || dbError.message;

      // 1. Check for Duplicate Role CODE
      if (
        errorMessage &&
        (errorMessage.includes("role_code") ||
          errorMessage.includes("uni_role_code"))
      ) {
        appLogger.warn("Role creation failed: Duplicate role code entry.");
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Validasi gagal",
          400,
          [
            {
              field: "role_code",
              message: "Kode role yang dimasukkan sudah ada.",
            },
          ]
        );
      }

      if (
        errorMessage &&
        (errorMessage.includes("name") || errorMessage.includes("uni_name"))
      ) {
        appLogger.warn("Role creation failed: Duplicate name entry.");
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Validasi gagal",
          400,
          [
            {
              field: "name",
              message: "Nama role yang dimasukkan sudah ada.",
            },
          ]
        );
      }
    }

    appLogger.error(`Error creating roles:${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [PUT] /roles/:id - Edit a Role
 */
export const updateRoles = async (req: Request, res: Response) => {
  try {
    // Validate and cast the ID params
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID role tidak valid.",
        400
      );
    }

    // Validate request body
    const validation = UpdateRoleSchema.safeParse(req.body);
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

    const roles = await editRole({
      id,
      name,
      description,
    });

    // Validate role not found
    if (!roles) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Role tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data role berhasil diperbarui",
      roles,
      200,
      RESPONSE_DATA_KEYS.ROLES
    );
  } catch (error) {
    appLogger.error(`Error editing roles:${error}`);

    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [DELETE] /roles/:id - Delete a Role
 */
export const destroyRole = async (req: Request, res: Response) => {
  try {
    // Validate and cast the ID params
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID Role tidak valid.",
        400
      );
    }

    const existing = await getRoleById(id);

    if (!existing) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Role tidak ditemukan",
        404
      );
    }

    await removeRole(existing.id);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Role berhasil dihapus",
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
        `Failed to delete role ID ${req.params.id} due to constraint.`
      );
      return errorResponse(
        res,
        API_STATUS.CONFLICT,
        "Tidak dapat menghapus Role karena masih digunakan oleh pegawai lain.",
        409
      );
    }

    if (dbError.code === "ER_DUP_ENTRY" || dbError.errno === 1062) {
      const errorMessage = dbError.sqlMessage || dbError.message;

      // 1. Check for Duplicate Role CODE
      if (
        errorMessage &&
        (errorMessage.includes("role_code") ||
          errorMessage.includes("uni_role_code"))
      ) {
        appLogger.warn("Role creation failed: Duplicate role code entry.");
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Kode Role yang dimasukkan sudah ada. Gunakan kode lain.",
          400
        );
      }
    }

    // Catch-all for other server errors
    appLogger.error(`Error editing roles:${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
