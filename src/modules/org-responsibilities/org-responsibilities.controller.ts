import { db } from "@database/connection.js";
import { Response, Request } from "express";
import {
  addOrgResponsibilitiesSchema,
  unassignLeaderSchema,
  updateOrgResponsibilitiesSchema,
} from "./org-responsibilities.schemas.js";
import { errorResponse, successResponse } from "@common/utils/response.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@common/constants/general.js";
import {
  addOrganizationLeader,
  editOrganizationLeader,
  getAllOrganizationLeader,
  getOrganizationLeaderById,
  removeOrganizationLeader,
  unassignOrganizationLeader,
} from "./org-responsibilities.model.js";
import { DatabaseError } from "@common/types/error.types.js";
import { appLogger } from "@common/utils/logger.js";
import {
  toOrgResponsibilitiesDetailResponse,
  toOrgResponsibilitiesPostOrPutResponse,
} from "./org-responsibilities.helper.js";

/**
 * [GET] /org-responsibilities - Fetch all Organization Leader
 */
export const fetchAllOrgResponsibilities = async (
  req: Request,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const search = (req.query.search as string) || "";
    const filterEmployeeCode = (req.query.employee_code as string) || "";
    const filterScopeType = (req.query.scope_type as string) || "";
    const filterIsActive = (req.query.is_active as string) || "";

    const { data, meta } = await getAllOrganizationLeader(
      page,
      limit,
      filterEmployeeCode,
      filterScopeType,
      filterIsActive,
      search
    );

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Pimpinan Organisasi Berhasil Didapatkan",
      data,
      200,
      RESPONSE_DATA_KEYS.ORG_RESPONSIBILITIES,
      meta
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching org responsibilities: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /org-responsibilities/:id - Get Organization Leader by id
 */
export const fetchOrgResponsibilitiesById = async (
  req: Request,
  res: Response
) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID pimpinan organisasi tidak valid.",
        400
      );
    }

    const leader = await getOrganizationLeaderById(id);

    if (!leader) {
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Pimpinan organisasi tidak ditemukan",
        404
      );
    }

    const result = toOrgResponsibilitiesDetailResponse(leader);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Pimpinan Organisasi Berhasil Didapatkan",
      result,
      200,
      RESPONSE_DATA_KEYS.ORG_RESPONSIBILITIES
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching org responsibilities: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 *`[POST] /org-responsibilities - Create Organization leader
 */
export const createOrgResponsibilities = async (
  req: Request,
  res: Response
) => {
  const trx = await db.transaction();
  try {
    const validation = addOrgResponsibilitiesSchema.safeParse(req.body);

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

    const leader = await addOrganizationLeader(trx, validation.data);

    await trx.commit();

    const result = toOrgResponsibilitiesPostOrPutResponse(leader);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data pimpinan organisasi berhasil ditambahkan",
      result,
      201,
      RESPONSE_DATA_KEYS.ORG_RESPONSIBILITIES
    );
  } catch (error) {
    await trx.rollback();
    const dbError = error as DatabaseError;
    appLogger.error(`[Assign Leader Error]: ${dbError}`);

    if (dbError.code === "ER_NO_REFERENCED_ROW_2" || dbError.errno === 1452) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Kode karyawan atau kode lingkup tidak ditemukan",
        400
      );
    }

    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan server",
      500
    );
  }
};

export const unassignOrgResponsibilities = async (
  req: Request,
  res: Response
) => {
  const trx = await db.transaction();
  try {
    const validation = unassignLeaderSchema.safeParse(req.body);

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

    // 2. Panggil Model Unassign
    // Model akan mengembalikan data pimpinan yang baru saja dinonaktifkan (lengkap dengan join)
    const oldLeader = await unassignOrganizationLeader(trx, validation.data);

    // 3. Cek Logika: Apakah ada pimpinan yang dicopot?
    // Jika null, berarti di unit tersebut MEMANG TIDAK ADA pimpinan aktif saat ini.
    if (!oldLeader) {
      await trx.rollback();
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Tidak ditemukan pimpinan aktif pada unit kerja tersebut. Posisi mungkin sudah kosong.",
        404
      );
    }

    // 4. Commit Transaksi (Simpan Perubahan)
    await trx.commit();

    // 5. Format Data Output
    // Karena model sudah melakukan JOIN, helper ini aman dipanggil
    const result = toOrgResponsibilitiesDetailResponse(oldLeader);

    // 6. Response Sukses
    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Pimpinan berhasil diberhentikan. Posisi sekarang KOSONG (Vacant).",
      result,
      200,
      RESPONSE_DATA_KEYS.ORG_RESPONSIBILITIES
    );
  } catch (error) {
    await trx.rollback();
    const dbError = error as DatabaseError;
    appLogger.error(`[Unassign Leader Error]: ${dbError}`);

    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan server",
      500
    );
  }
};

/**
 * [PUT] /org-responsibilities/:id - Update Organization Leader
 */
export const updateOrgResponsibilities = async (
  req: Request,
  res: Response
) => {
  const trx = await db.transaction();
  try {
    const id: number = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      await trx.rollback();
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID pimpinan organisasi tidak valid",
        400
      );
    }

    const validation = updateOrgResponsibilitiesSchema.safeParse(req.body);

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

    const leader = await editOrganizationLeader(trx, id, validation.data);

    if (!leader) {
      await trx.rollback();
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Data pimpinan organisasi tidak ditemukan",
        404
      );
    }

    await trx.commit();

    const result = toOrgResponsibilitiesPostOrPutResponse(leader);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data pimpinan organisasi berhasil diperbarui",
      result,
      200,
      RESPONSE_DATA_KEYS.ORG_RESPONSIBILITIES
    );
  } catch (error) {
    await trx.rollback();
    const dbError = error as DatabaseError;
    appLogger.error(`[Assign Leader Error]: ${dbError}`);

    if (dbError.code === "ER_NO_REFERENCED_ROW_2" || dbError.errno === 1452) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "Kode karyawan atau kode lingkup tidak ditemukan",
        400
      );
    }

    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan server",
      500
    );
  }
};

/**
 * [DELETE] /org-responsibilities/:id - Delete Organization Leader
 */
export const destroyOrgResponsibilities = async (
  req: Request,
  res: Response
) => {
  try {
    const id: number = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID pimpinan organisasi tidak valid",
        400
      );
    }

    const existing = await getOrganizationLeaderById(id);

    if (!existing) {
      // Return 404 Not Found (Sesuai Request: Status "04")
      return errorResponse(
        res,
        API_STATUS.NOT_FOUND,
        "Pimpinan organisasi tidak ditemukan",
        404
      );
    }

    await removeOrganizationLeader(existing.id);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Pimpinan Organisasi Berhasil Dihapus",
      null,
      200
    );
  } catch (error) {
    const dbError = error as DatabaseError;
    appLogger.error(`[Delete Leader Error]: ${dbError}`);

    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan server saat menghapus data",
      500
    );
  }
};
