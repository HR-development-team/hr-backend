import { Request, Response } from "express";
import { errorResponse, successResponse } from "@utils/response.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@constants/general.js";
import { appLogger } from "src/common/utils/logger.js";
import { DatabaseError } from "@common/types/error.types.js";
import {
  addMasterDepartments,
  editMasterDepartments,
  getAllMasterDepartments,
  getMasterDepartmentsById,
  removeMasterDepartments,
  getMasterDepartmentByCode,
} from "./department.model.js";
import {
  addMasterDepartmentsSchema,
  updateMasterDepartmentsSchema,
} from "./department.schemas.js";
import { getMasterOfficeByCode } from "../offices/office.model.js";
/**
 * [GET] /master-departments - Fetch all Departments
 */
export const fetchAllMasterDepartments = async (
  req: Request,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;

    const departments = await getAllMasterDepartments(page, limit);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Departemen berhasil di dapatkan",
      departments,
      200,
      RESPONSE_DATA_KEYS.DEPARTMENTS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching departments:${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /master-departments/:id - Fetch Department by id
 */
export const fetchMasterDepartmentsById = async (
  req: Request,
  res: Response
) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID departemen tidak valid.",
        400
      );
    }

    const department = await getMasterDepartmentsById(id);

    // Format Tanggal untuk Wrapper Response (YYYYMMDDHHmmss)
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    if (!department) {
      // Return 404 Sesuai Format
      return res.status(404).json({
        status: "03",
        message: "Departemen tidak ditemukan",
        datetime: datetime,
      });
    }

    // Return 200 Sesuai Format
    return res.status(200).json({
      status: "00",
      message: "Data Departemen Berhasil Didapatkan",
      datetime: datetime,
      departments: department, // Object (bukan Array)
    });
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching department by id: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [POST] /master-departments - Create a new Department
 */
/**
 * [POST] /master-departments - Create a new Department
 */
/**
 * [POST] /master-departments - Create a new Department
 */
export const createMasterDepartments = async (req: Request, res: Response) => {
  try {
    const validation = addMasterDepartmentsSchema.safeParse(req.body);

    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

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

    const { name, description, office_code } = validation.data;

    // 1. Cek Apakah Kantor Ada?
    const officeExists = await getMasterOfficeByCode(office_code);

    if (!officeExists) {
      return res.status(400).json({
        status: "99",
        message: "Kantor tidak ditemukan.",
        datetime: datetime,
      });
    }

    // 2. Simpan Data ke Database
    const newDepartment = await addMasterDepartments({
      name,
      description,
      office_code,
    });

    // 3. [PENTING] Definisikan departmentData di sini!
    // Kita pisahkan created_at dan updated_at agar tidak ikut terkirim.
    // ID tetap ada di dalam departmentData.
    const { created_at, updated_at, ...departmentData } = newDepartment;

    return res.status(201).json({
      status: "00",
      message: "Data Departemen Berhasil Ditambahkan",
      datetime: datetime,
      // Sekarang variable departmentData sudah dikenali
      departments: departmentData,
    });
  } catch (error) {
    const dbError = error as DatabaseError;

    if (dbError.code === "ER_DUP_ENTRY" || dbError.errno === 1062) {
      const errorMessage = dbError.sqlMessage || dbError.message;
      if (
        errorMessage &&
        (errorMessage.includes("department_code") ||
          errorMessage.includes("uni_department_code"))
      ) {
        appLogger.warn(
          "Department creation failed: Duplicate department code."
        );
        return errorResponse(
          res,
          API_STATUS.BAD_REQUEST,
          "Validasi gagal",
          400,
          [
            {
              field: "name",
              message: "Kode departemen yang dimasukkan sudah ada.",
            },
          ]
        );
      }
    }

    appLogger.error(`Error creating departments: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
/**
 * [PUT] /master-departments/:id - Edit a Department
 */
export const updateMasterDepartments = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID departemen tidak valid.",
        400
      );
    }

    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    // 1. Validasi Input Dasar
    const validation = updateMasterDepartmentsSchema.safeParse(req.body);
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

    const { name, description, office_code } = validation.data;

    // 2. [PERBAIKAN UTAMA] Pasang Satpam (Cek Kantor) Disini!
    // Kita hanya cek jika user mengirimkan office_code baru
    if (office_code) {
      const officeExists = await getMasterOfficeByCode(office_code);

      if (!officeExists) {
        // Return Error Status 99 (Kantor Tidak Ditemukan)
        return res.status(400).json({
          status: "99",
          message: "Kantor tidak ditemukan.",
          datetime: datetime,
        });
      }
    }

    // 3. Lanjut Update ke Database (Aman)
    const updatedDepartment = await editMasterDepartments({
      id,
      name,
      description,
      office_code,
    });

    if (!updatedDepartment) {
      return res.status(404).json({
        status: "03",
        message: "Data Departemen tidak ditemukan",
        datetime: datetime,
      });
    }

    // 4. Format Output
    const { created_at, updated_at, ...cleanDepartment } = updatedDepartment;

    return res.status(200).json({
      status: "00",
      message: "Data Departemen Berhasil Diperbarui",
      datetime: datetime,
      departments: cleanDepartment,
    });
  } catch (error) {
    appLogger.error(`Error editing departments: ${error}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
/**
 * [DELETE] /master-departments/:id - Delete a Department
 */
export const destroyMasterDepartments = async (req: Request, res: Response) => {
  try {
    // 1. Validasi ID
    const id: number = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return errorResponse(
        res,
        API_STATUS.BAD_REQUEST,
        "ID departemen tidak valid.",
        400
      );
    }

    // Format Tanggal
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    // 2. Cek Apakah Data Ada?
    const existing = await getMasterDepartmentsById(id);

    if (!existing) {
      // Return 404 Not Found (Sesuai Request: Status "04")
      return res.status(404).json({
        status: "04",
        message: "Departemen tidak ditemukan",
        datetime: datetime,
      });
    }

    // 3. Eksekusi Hapus
    await removeMasterDepartments(existing.id);

    // Return 200 OK (Sesuai Request: Status "00")
    return res.status(200).json({
      status: "00",
      message: "Data Departemen Berhasil Dihapus",
      datetime: datetime,
    });
  } catch (error) {
    const dbError = error as DatabaseError;
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    // 4. Handle Foreign Key Constraint (Konflik)
    // Error 1451 / ER_ROW_IS_REFERENCED artinya departemen ini dipakai di tabel lain (misal: employees)
    if (
      dbError.code === "ER_ROW_IS_REFERENCED" ||
      dbError.code === "ER_ROW_IS_REFERENCED_2" ||
      dbError.errno === 1451
    ) {
      // Return 409 Conflict (Sesuai Request: Status "05")
      return res.status(409).json({
        status: "05",
        message:
          "Tidak dapat menghapus departemen yang masih memiliki karyawan terasosiasi.",
        datetime: datetime,
      });
    }

    // Error Server Lainnya
    appLogger.error(`Error deleting department: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};

/**
 * [GET] /master-departments/code/:department_code - Fetch Department by Code
 */
export const fetchMasterDepartmentByCode = async (
  req: Request,
  res: Response
) => {
  try {
    const { department_code } = req.params;

    // Panggil Model
    const department = await getMasterDepartmentByCode(department_code);

    // Format Tanggal
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    // Handle 404 (Tidak Ditemukan)
    if (!department) {
      return res.status(404).json({
        status: "03",
        message: "Departemen tidak ditemukan",
        datetime: datetime,
      });
    }

    // Handle 200 (Sukses)
    return res.status(200).json({
      status: "00",
      message: "Data Departemen Berhasil Didapatkan",
      datetime: datetime,
      departments: department,
    });
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching department by code: ${dbError}`);
    return errorResponse(
      res,
      API_STATUS.FAILED,
      "Terjadi kesalahan pada server",
      500
    );
  }
};
