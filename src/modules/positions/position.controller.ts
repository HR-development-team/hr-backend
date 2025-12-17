import { Request, Response } from "express";
import { appLogger } from "@utils/logger.js";
import { z, ZodError } from "zod"; // <--- 1. IMPORT ZOD DISINI
import {
  getPositionsByOffice,
  getAllPositions,
  getOfficeByCodeOrId,
  getPositionById,
  getPositionByCode,
  checkDivisionExists,
  checkPositionExists,
  generateNextPositionCode,
  createPosition,
  updatePosition, // <--- [FIX 1] Import ini tadi hilang
  countEmployeesByPositionCode,
  countChildPositionsByCode,
  deletePositionById,
} from "./position.model.js";
import { OrganizationTree, PositionRaw } from "./position.types.js";
import { API_STATUS, RESPONSE_DATA_KEYS } from "@common/constants/general.js";
import { successResponse } from "@common/utils/response.js";

// --- [HELPER 1] ALGORITMA PENYUSUN POHON ---
const buildOrganizationTree = (items: PositionRaw[]): OrganizationTree[] => {
  const dataMap: { [key: string]: OrganizationTree } = {};

  items.forEach((item) => {
    dataMap[item.position_code] = {
      position_code: item.position_code,
      name: item.name,
      employee_code: item.employee_code,
      employee_name: item.employee_name,
      children: [],
    };
  });

  const tree: OrganizationTree[] = [];

  items.forEach((item) => {
    const node = dataMap[item.position_code];
    if (item.parent_position_code && dataMap[item.parent_position_code]) {
      dataMap[item.parent_position_code].children.push(node);
    } else {
      tree.push(node);
    }
  });

  return tree;
};

// --- [HELPER 2] CEK CIRCULAR REFERENCE (Untuk Update) ---
// [FIX 2] Fungsi ini tadi hilang, sekarang ditambahkan kembali
const isCircularReference = async (
  myPositionCode: string,
  targetParentCode: string
): Promise<boolean> => {
  // 1. Cek Self-Reference
  if (myPositionCode === targetParentCode) return true;

  // 2. Cek Ancestry (Telusuri ke atas)
  let currentCode: string | null = targetParentCode;

  while (currentCode) {
    const parentNode = await getPositionByCode(currentCode);

    // Jika data putus/tidak ketemu, berhenti
    if (!parentNode) break;

    // Jika bapaknya si target ternyata adalah SAYA, berarti circular!
    if (parentNode.parent_position_code === myPositionCode) {
      return true;
    }

    // Lanjut naik ke atas
    currentCode = parentNode.parent_position_code;
  }

  return false;
};

/**
 * 1. [GET] Organization Tree
 */
export const fetchOrganizationTree = async (req: Request, res: Response) => {
  try {
    const { office_id } = req.params;
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    const office = await getOfficeByCodeOrId(office_id);

    if (!office) {
      return res.status(404).json({
        error: true,
        message: "Kantor tidak ditemukan",
        datetime: datetime,
      });
    }

    const rawPositions = await getPositionsByOffice(office_id);
    const organizationTree = buildOrganizationTree(rawPositions);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      `Data Organisasi ${office.name} Berhasil Didapatkan`,
      organizationTree,
      200,
      RESPONSE_DATA_KEYS.POSITIONS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching organization tree: ${dbError}`);
    return res.status(500).json({
      status: "01",
      message: "Terjadi kesalahan pada server",
    });
  }
};

/**
 * 2. [GET] Position List
 */
export const fetchPositionList = async (req: Request, res: Response) => {
  try {
    const { office_code } = req.query;
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    if (office_code) {
      const office = await getOfficeByCodeOrId(office_code as string);
      if (!office) {
        return res.status(404).json({
          error: true,
          message: "Kantor tidak ditemukan",
          datetime: datetime,
        });
      }
    }

    const positions = await getAllPositions(office_code as string);

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Jabatan Berhasil Didapatkan",
      positions,
      200,
      RESPONSE_DATA_KEYS.POSITIONS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching positions list: ${dbError}`);
    return res.status(500).json({
      status: "01",
      message: "Terjadi kesalahan pada server",
    });
  }
};

/**
 * 3. [GET] Position By ID
 */
export const fetchPositionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    const positionId = Number(id);
    if (isNaN(positionId)) {
      return res.status(400).json({
        status: "01",
        message: "ID Posisi harus berupa angka",
      });
    }

    const rawPosition = await getPositionById(positionId);

    if (!rawPosition) {
      return res.status(404).json({
        status: "03",
        message: "Posisi tidak ditemukan",
        datetime: datetime,
      });
    }

    const formattedPosition = {
      id: rawPosition.id,
      position_code: rawPosition.position_code,
      division_code: rawPosition.division_code,
      department_code: rawPosition.department_code,
      division_name: rawPosition.division_name,
      parent_position_code: rawPosition.parent_position_code,
      parent_position_name: rawPosition.parent_position_name,
      name: rawPosition.name,
      base_salary: parseFloat(rawPosition.base_salary),
      sort_order: rawPosition.sort_order,
      description: rawPosition.description,
      created_at: rawPosition.created_at,
      updated_at: rawPosition.updated_at,
    };

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Jabatan Berhasil Didapatkan",
      formattedPosition,
      200,
      RESPONSE_DATA_KEYS.POSITIONS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching position by id: ${dbError}`);
    return res.status(500).json({
      status: "01",
      message: "Terjadi kesalahan pada server",
    });
  }
};

/**
 * 4. [GET] Position By Code
 */
export const fetchPositionByCode = async (req: Request, res: Response) => {
  try {
    const { position_code } = req.params;
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    const rawPosition = await getPositionByCode(position_code);

    if (!rawPosition) {
      return res.status(404).json({
        status: "03",
        message: "Posisi tidak ditemukan",
        datetime: datetime,
      });
    }

    const formattedPosition = {
      id: rawPosition.id,
      position_code: rawPosition.position_code,
      department_code: rawPosition.department_code,
      department_name: rawPosition.department_name,
      division_code: rawPosition.division_code,
      division_name: rawPosition.division_name,
      parent_position_code: rawPosition.parent_position_code,
      parent_position_name: rawPosition.parent_position_name,
      name: rawPosition.name,
      base_salary: parseFloat(rawPosition.base_salary),
      sort_order: rawPosition.sort_order,
      description: rawPosition.description,
      created_at: rawPosition.created_at,
      updated_at: rawPosition.updated_at,
    };

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Jabatan Berhasil Didapatkan",
      formattedPosition,
      200,
      RESPONSE_DATA_KEYS.POSITIONS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching position by code: ${dbError}`);
    return res.status(500).json({
      status: "01",
      message: "Terjadi kesalahan pada server",
    });
  }
};

/**
 * 5. [POST] Create New Position
 */
export const createNewPosition = async (req: Request, res: Response) => {
  try {
    const {
      division_code,
      parent_position_code,
      name,
      base_salary,
      sort_order,
      description,
    } = req.body;

    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    // 1. Validasi Input Dasar
    if (!division_code || !name || !base_salary) {
      return res.status(400).json({
        status: "01",
        message: "Field division_code, name, dan base_salary wajib diisi.",
        datetime: datetime,
      });
    }

    // 2. Validasi Division Code
    const isDivisionValid = await checkDivisionExists(division_code);
    if (!isDivisionValid) {
      return res.status(400).json({
        status: "01",
        message: `Division Code '${division_code}' tidak ditemukan.`,
        datetime: datetime,
      });
    }

    // 3. Validasi Parent Position
    if (parent_position_code) {
      // 3a. Validasi Panjang Karakter (Harus 10)
      if (parent_position_code.length !== 10) {
        return res.status(400).json({
          status: "01",
          message:
            "Parent Position Code harus tepat 10 karakter (Contoh: JBT0000001).",
          datetime: datetime,
        });
      }

      // 3b. Cek Circular Reference DULUAN
      const nextCode = await generateNextPositionCode();
      if (parent_position_code === nextCode) {
        return res.status(400).json({
          status: "99",
          message:
            "Tidak dapat membuat referensi melingkar dalam organisasi posisi.",
          datetime: datetime,
        });
      }

      // 3c. Cek apakah Parent ada di database
      const isParentValid = await checkPositionExists(parent_position_code);
      if (!isParentValid) {
        return res.status(400).json({
          status: "01",
          message: `Parent Position Code '${parent_position_code}' tidak ditemukan.`,
          datetime: datetime,
        });
      }
    }

    // 4. Generate Kode Baru
    const newPositionCode = await generateNextPositionCode();

    // 5. Siapkan Data Insert
    const newPositionData = {
      position_code: newPositionCode,
      division_code,
      parent_position_code: parent_position_code || null,
      name,
      base_salary: parseFloat(base_salary),
      sort_order: sort_order || 0,
      description: description || null,
    };

    // 6. Simpan ke Database
    const createdPosition = await createPosition(newPositionData);

    // 7. Format Respon (Bersih tanpa timestamps)
    const responseData = {
      id: createdPosition.id,
      position_code: createdPosition.position_code,
      division_code: createdPosition.division_code,
      parent_position_code: createdPosition.parent_position_code,
      name: createdPosition.name,
      base_salary: parseFloat(createdPosition.base_salary),
      sort_order: createdPosition.sort_order,
      description: createdPosition.description,
    };

    return successResponse(
      res,
      API_STATUS.SUCCESS,
      "Data Jabatan Berhasil Ditambahkan",
      responseData,
      200,
      RESPONSE_DATA_KEYS.POSITIONS
    );
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error creating position: ${dbError}`);
    return res.status(500).json({
      status: "01",
      message: "Terjadi kesalahan pada server",
    });
  }
};
const updateMasterPositionsSchema = z
  .object({
    name: z
      .string()
      .min(3, "Nama posisi minimal 3 karakter")
      .max(100, "Nama posisi maksimal 100 karakter")
      .optional(),
    division_code: z
      .string()
      .length(10, "Kode divisi harus tepat 10 karakter")
      .optional(),
    base_salary: z
      .number({
        invalid_type_error: "Gaji pokok harus berupa angka.",
      })
      .min(1000000, "Gaji pokok minimal 1.000.000")
      .max(100000000, "Gaji pokok maksimal 100.000.000")
      .optional(),
    description: z
      .string()
      .max(500, "Deskripsi maksimal 500 karakter.")
      .optional(),
    parent_position_code: z.string().length(10).optional(),
    sort_order: z.number().optional(),
  })
  .strict()
  // LOGIKA: Mencegah body kosong
  .refine((data) => Object.keys(data).length > 0, {
    message:
      "Setidaknya satu field (name, division_code, dll) harus diisi untuk pembaruan.",
    path: ["body"],
  });

// ==========================================
// 2. CONTROLLER UTAMA
// ==========================================
export const updatePositionDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Setup Datetime
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    // -----------------------------------------------------------
    // [VALIDASI INPUT] Menggunakan Zod secara manual
    // -----------------------------------------------------------
    try {
      await updateMasterPositionsSchema.parseAsync(req.body);
    } catch (validationError) {
      if (validationError instanceof ZodError) {
        const formattedErrors = validationError.errors.map((issue) => ({
          field: issue.path.join(".") || "body",
          message: issue.message,
        }));

        // Return Error Custom Status 99
        return res.status(400).json({
          status: "99",
          message: "Validasi gagal",
          datetime: datetime,
          errors: formattedErrors,
        });
      }
      throw validationError; // Lempar error lain jika bukan Zod
    }
    // -----------------------------------------------------------

    const positionId = Number(id);
    if (isNaN(positionId)) {
      return res.status(400).json({
        status: "01",
        message: "ID Posisi harus berupa angka",
      });
    }

    // 1. Cek Existing Position
    const existingPosition = await getPositionById(positionId);
    if (!existingPosition) {
      return res.status(404).json({
        status: "03",
        message: "Posisi tidak ditemukan",
        datetime: datetime,
      });
    }

    // Ambil data dari body
    const {
      division_code,
      parent_position_code,
      name,
      base_salary,
      sort_order,
      description,
    } = req.body;

    // 2. Validasi Division (Logic Database)
    if (division_code) {
      const isDivisionValid = await checkDivisionExists(division_code);
      if (!isDivisionValid) {
        return res.status(400).json({
          status: "01",
          message: `Division Code '${division_code}' tidak ditemukan.`,
          datetime: datetime,
        });
      }
    }

    // 3. Validasi Parent (Logic Database)
    if (parent_position_code) {
      // 3a. Cek apakah parent ada di DB
      const isParentValid = await checkPositionExists(parent_position_code);
      if (!isParentValid) {
        return res.status(400).json({
          status: "01",
          message: `Parent Position Code '${parent_position_code}' tidak ditemukan.`,
          datetime: datetime,
        });
      }

      // 3b. Cek Circular Reference (Disini perbaikan error 'unused variable' tadi)
      // Pastikan fungsi isCircularReference tersedia di scope ini
      const isCircular = await isCircularReference(
        existingPosition.position_code,
        parent_position_code
      );

      if (isCircular) {
        return res.status(400).json({
          status: "99",
          message:
            "Tidak dapat membuat referensi melingkar (Circular Reference). Posisi bawahan tidak boleh menjadi atasan.",
          datetime: datetime,
        });
      }
    }

    // 4. Update Database
    const updateData: any = {};
    if (division_code !== undefined) updateData.division_code = division_code;
    if (parent_position_code !== undefined)
      updateData.parent_position_code = parent_position_code;
    if (name !== undefined) updateData.name = name;
    if (base_salary !== undefined) updateData.base_salary = base_salary;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    if (description !== undefined) updateData.description = description;

    const updatedRaw = await updatePosition(positionId, updateData);

    // Format Response
    const responseData = {
      id: updatedRaw.id,
      position_code: updatedRaw.position_code,
      division_code: updatedRaw.division_code,
      parent_position_code: updatedRaw.parent_position_code,
      name: updatedRaw.name,
      base_salary: parseFloat(updatedRaw.base_salary),
      sort_order: updatedRaw.sort_order,
      description: updatedRaw.description,
      updated_at: updatedRaw.updated_at,
    };

    return res.status(200).json({
      status: "00",
      message: "Data Posisi Berhasil Diperbarui",
      datetime: datetime,
      positions: responseData,
    });
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error updating position: ${dbError}`);
    return res.status(500).json({
      status: "01",
      message: "Terjadi kesalahan pada server",
    });
  }
};

/**
 * 7. [DELETE] Delete Position
 * Gagal jika posisi ditempati karyawan atau punya posisi bawahan.
 */
export const deletePositionDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    const positionId = Number(id);
    if (isNaN(positionId)) {
      return res.status(400).json({
        status: "01",
        message: "ID Posisi harus berupa angka",
      });
    }

    const existingPosition = await getPositionById(positionId);
    if (!existingPosition) {
      return res.status(404).json({
        status: "04",
        message: "Posisi tidak ditemukan",
        datetime: datetime,
      });
    }

    const positionCode = existingPosition.position_code;

    const employeeCount = await countEmployeesByPositionCode(positionCode);
    const childCount = await countChildPositionsByCode(positionCode);

    if (employeeCount > 0 || childCount > 0) {
      return res.status(409).json({
        status: "05",
        message:
          "Tidak dapat menghapus posisi yang memiliki karyawan terasosiasi atau posisi bawahan.",
        datetime: datetime,
      });
    }

    await deletePositionById(positionId);

    return res.status(200).json({
      status: "00",
      message: "Data Posisi Berhasil Dihapus",
      datetime: datetime,
    });
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error deleting position: ${dbError}`);
    return res.status(500).json({
      status: "01",
      message: "Terjadi kesalahan pada server",
    });
  }
};
