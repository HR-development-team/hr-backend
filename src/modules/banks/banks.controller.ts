import { API_STATUS, RESPONSE_DATA_KEYS } from "@common/constants/general.js";
import { AuthenticatedRequest } from "@common/types/auth.type.js";
import { appLogger } from "@common/utils/logger.js";
import { errorResponse, successResponse } from "@common/utils/response.js";
import { Response } from "express";
import { getAllBankOptions } from "./banks.model.js";

/**
 * [GET] /master-bank/options - Get all bank account data
 */
export const fetchBankOptions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const search = (req.query.search as string) || "";

    const options = await getAllBankOptions(search);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "List bank berhasil didapatkan",
      options,
      200,
      RESPONSE_DATA_KEYS.BANK
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching bank options: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
