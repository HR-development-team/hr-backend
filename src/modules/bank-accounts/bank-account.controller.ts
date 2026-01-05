import { Response } from "express";
import { AuthenticatedRequest } from "@common/types/auth.type.js";
import { errorResponse, successResponse } from "@common/utils/response.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@common/constants/general.js";
import {
  addBankAccountSchema,
  updateBankAccountSchema,
} from "./bank-account.schemas.js";
import {
  addBankAccount,
  editBankAccountByEmployeeCode,
} from "./bank-account.model.js";
import { appLogger } from "@common/utils/logger.js";
import { DatabaseError } from "@common/types/error.types.js";

/**
 * [POST] /bank-account - Create bank account data
 */
export const createBankAccount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const validation = addBankAccountSchema.safeParse(req.body);

    if (!validation.success) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Validasi Gagal",
        400,
        validation.error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        }))
      );
    }

    const newBankAccount = await addBankAccount(validation.data);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Akun Bank Berhasil Ditambahkan",
      newBankAccount,
      201,
      RESPONSE_DATA_KEYS.BANK_ACCOUNT
    );
  } catch (error) {
    const dbError = error as DatabaseError;

    appLogger.error(`Database Error: ${dbError}`);
    if (
      dbError.code === "23505" ||
      dbError.code === "ER_DUP_ENTRY" ||
      dbError.errno === 1062
    ) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST, // Atau 409 CONFLICT
        "Gagal Menambahkan Data",
        400,
        [
          {
            field: "employee_code",
            message: "Karyawan ini sudah memiliki akun bank yang terdaftar.",
          },
        ]
      );
    }

    // 2. Tangani Error Foreign Key (Kode karyawan tidak ada di tabel employee)
    // PostgreSQL: '23503', MySQL: 'ER_NO_REFERENCED_ROW_2' atau '1452'
    if (
      dbError.code === "23503" ||
      dbError.code === "ER_NO_REFERENCED_ROW_2" ||
      dbError.errno === 1452
    ) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Gagal Menambahkan Data",
        404,
        [
          {
            field: "employee_code",
            message: "Data karyawan dengan kode tersebut tidak ditemukan.",
          },
        ]
      );
    }

    // 3. Error General/Internal Server Error
    appLogger.error(`Error creating bank account: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan internal pada server",
      500
    );
  }
};

/**
 * Update /bank-accounts/:id - Update bank account
 */
export const updateBankAccountByEmployeeCode = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const employeeCode = (req.params.employee_code as string) || "";

    if (!employeeCode) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Kode karyawan tidak valid",
        400
      );
    }

    const validation = updateBankAccountSchema.safeParse(req.body);

    if (!validation.success) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Validasi gagal",
        400,
        validation.error.errors.map((err) => ({
          field: err.path[0],
        }))
      );
    }

    const data = validation.data;

    const updatedBankAccount = await editBankAccountByEmployeeCode(
      employeeCode,
      {
        ...data,
      }
    );

    if (!updatedBankAccount) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data akun rekening tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Akun Rekening Berhasil Diperbarui",
      updatedBankAccount,
      200,
      RESPONSE_DATA_KEYS.BANK_ACCOUNT
    );
  } catch (error) {
    const dbError = error as DatabaseError;

    appLogger.error(`Database Error: ${dbError}`);
    if (
      dbError.code === "23505" ||
      dbError.code === "ER_DUP_ENTRY" ||
      dbError.errno === 1062
    ) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST, // Atau 409 CONFLICT
        "Gagal Menambahkan Data",
        400,
        [
          {
            field: "employee_code",
            message: "Karyawan ini sudah memiliki akun bank yang terdaftar.",
          },
        ]
      );
    }

    // 2. Tangani Error Foreign Key (Kode karyawan tidak ada di tabel employee)
    // PostgreSQL: '23503', MySQL: 'ER_NO_REFERENCED_ROW_2' atau '1452'
    if (
      dbError.code === "23503" ||
      dbError.code === "ER_NO_REFERENCED_ROW_2" ||
      dbError.errno === 1452
    ) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Gagal Menambahkan Data",
        404,
        [
          {
            field: "employee_code",
            message: "Data karyawan dengan kode tersebut tidak ditemukan.",
          },
        ]
      );
    }

    // 3. Error General/Internal Server Error
    appLogger.error(`Error creating bank account: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan internal pada server",
      500
    );
  }
};
