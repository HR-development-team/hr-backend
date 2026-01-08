import { API_STATUS, RESPONSE_DATA_KEYS } from "@common/constants/general.js";
import { AuthenticatedRequest } from "@common/types/auth.type.js";
import { errorResponse, successResponse } from "@common/utils/response.js";
import { Response } from "express";
import { getOrgStructureService } from "./organization.service.js";
import { DatabaseError } from "@common/types/error.types.js";
import { appLogger } from "@common/utils/logger.js";
import { officeHierarchyQuery } from "@modules/offices/office.helper.js";

export const fetchOrganizationStructure = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUser = req.user!;

    const userOfficeCode = currentUser?.office_code;
    const officeCode = req.params.office_code as string;

    const isAllowed = await officeHierarchyQuery(userOfficeCode)
      .where("office_tree.office_code", officeCode)
      .first();

    if (!isAllowed) {
      return errorResponse(
        res,
        API_STATUS.FORBIDDEN,
        "Anda tidak memiliki akses ke data kantor ini",
        403
      );
    }

    if (!userOfficeCode) {
      return errorResponse(
        res,
        API_STATUS.FORBIDDEN,
        "Akun ini belum terhubung ke data kantor",
        403
      );
    }

    const data = await getOrgStructureService(officeCode);
    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Hierarki Organisasi Berhasil Didapatkan",
      data,
      200,
      RESPONSE_DATA_KEYS.ORGANIZATION
    );
  } catch (error) {
    const dbError = error as DatabaseError;
    appLogger.error(`Error fetching office hierarchy: ${dbError}`);

    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan server",
      500
    );
  }
};
