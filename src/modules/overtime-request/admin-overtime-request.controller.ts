import { Request, Response } from "express";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@constants/general.js";
import { appLogger } from "@utils/logger.js";
import { errorResponse, successResponse } from "@utils/response.js";
import { AuthenticatedRequest } from "@middleware/jwt.js";
import {
  editOvertimeRequestStatus,
  getAllOvertimeRequests,
  getOvertimeRequestById,
  removeOvertimeRequest,
} from "./overtime-request.model.js";
import { updateOvertimeStatusSchema } from "./overtime-request.schemas.js";

/**
 * [GET] /overtime-requests - Admin Fetch All
 */
export const fetchAllOvertimeRequest = async (req: Request, res: Response) => {
  try {
    const userCode = req.query.user_code as string | undefined;
    const status = req.query.status as
      | "Pending"
      | "Approved"
      | "Rejected"
      | undefined;

    const requests = await getAllOvertimeRequests({
      userCode,
      status,
    });

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Daftar pengajuan lembur berhasil didapatkan.",
      requests,
      200,
      RESPONSE_DATA_KEYS.OVERTIME_REQUESTS
    );
  } catch (error) {
    appLogger.error(`Error fetching all overtime requests:${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server.",
      500
    );
  }
};

/**
 * [GET] /overtime-requests/:id
 */
export const fetchOvertimeRequestById = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(res, API_STATUS.BAD_REQUEST, "ID tidak valid.", 400);
    }

    const request = await getOvertimeRequestById(id);
    if (!request) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data Lembur tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Detail lembur berhasil didapatkan",
      request,
      200,
      RESPONSE_DATA_KEYS.OVERTIME_REQUESTS
    );
  } catch (error) {
    appLogger.error(`Error fetching overtime details:${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan server",
      500
    );
  }
};

/**
 * [PUT] /overtime-requests/:id/status - Approve or Reject
 */
export const updateOvertimeRequestStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const adminId = req.user!.id;
  const requestId = parseInt(req.params.id, 10);

  try {
    if (isNaN(requestId)) {
      return errorResponse(res, API_STATUS.BAD_REQUEST, "ID tidak valid.", 400);
    }

    const validation = updateOvertimeStatusSchema.safeParse(req.body);
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

    const existingRequest = await getOvertimeRequestById(requestId);
    if (!existingRequest) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Pengajuan tidak ditemukan.",
        404
      );
    }
    if (existingRequest.status !== "Pending") {
      return errorResponse(
        res,
        API_STATUS.CONFLICT,
        `Pengajuan sudah berstatus '${existingRequest.status}'.`,
        409
      );
    }

    const updatedRequest = await editOvertimeRequestStatus({
      id: existingRequest.id,
      new_status: validation.data.status,
      approved_by_id: adminId,
    });

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      `Pengajuan lembur berhasil di${
        validation.data.status === "Approved" ? "setujui" : "tolak"
      }.`,
      updatedRequest,
      200,
      RESPONSE_DATA_KEYS.OVERTIME_REQUESTS
    );
  } catch (error) {
    appLogger.error(`Error processing overtime decision:${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan server.",
      500
    );
  }
};

/**
 * [DELETE] /overtime-requests/:id
 */
export const destroyOvertimeRequest = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(res, API_STATUS.BAD_REQUEST, "ID tidak valid.", 400);
    }

    const existing = await getOvertimeRequestById(id);
    if (!existing) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data tidak ditemukan",
        404
      );
    }

    await removeOvertimeRequest(id);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data berhasil dihapus",
      null,
      200
    );
  } catch (error) {
    appLogger.error(`Error deleting overtime:${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan server",
      500
    );
  }
};
