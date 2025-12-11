import { Request, Response } from "express";
import { appLogger } from "@utils/logger.js";
import {
  getPositionsByOffice,
  getAllPositions,
  getOfficeByCodeOrId,
  getPositionById,
} from "./position.model.js";
import { OrganizationTree, PositionRaw } from "./position.types.js";

// --- [HELPER] ALGORITMA PENYUSUN POHON (REKURSIF) ---
const buildOrganizationTree = (items: PositionRaw[]): OrganizationTree[] => {
  const dataMap: { [key: string]: OrganizationTree } = {};

  // 1. Inisialisasi Node
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

  // 2. Link Parent ke Child
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

/**
 * Endpoint 1: Organization Tree Structure
 * [GET] /positions/organization/:office_id
 */
export const fetchOrganizationTree = async (req: Request, res: Response) => {
  try {
    const { office_id } = req.params;

    // Format Tanggal (Prettier Friendly)
    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    // 1. Validasi Kantor
    const office = await getOfficeByCodeOrId(office_id);

    if (!office) {
      return res.status(404).json({
        error: true,
        message: "Kantor tidak ditemukan",
        datetime: datetime,
      });
    }

    // 2. Ambil Data Flat dari DB
    const rawPositions = await getPositionsByOffice(office_id);

    // 3. Susun menjadi Pohon (Tree)
    const organizationTree = buildOrganizationTree(rawPositions);

    // 4. Response
    return res.status(200).json({
      status: "00",
      message: `Data Organisasi ${office.name} Berhasil Didapatkan`,
      office_code: office.office_code,
      datetime: datetime,
      organizations: organizationTree,
    });
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
 * Endpoint 2: Get Position List (Optional Filter)
 * [GET] /positions
 * Query param: ?office_code=OFC...
 */
export const fetchPositionList = async (req: Request, res: Response) => {
  try {
    const { office_code } = req.query;

    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    // 1. Validasi Office (Jika user mengirim filter)
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

    // 2. Ambil Data
    const positions = await getAllPositions(office_code as string);

    // 3. Response
    return res.status(200).json({
      status: "00",
      message: "Data Jabatan Berhasil Didapatkan",
      datetime: datetime,
      positions: positions,
    });
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
 * Endpoint 3: Get Position By ID
 * [GET] /positions/:id
 */
export const fetchPositionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const now = new Date();
    const datetime = now
      .toISOString()
      .replace(/[-T:Z.]/g, "")
      .slice(0, 14);

    // 1. Validasi Input
    const positionId = Number(id);
    if (isNaN(positionId)) {
      return res.status(400).json({
        status: "01",
        message: "ID Posisi harus berupa angka",
      });
    }

    // 2. Ambil Data Mentah dari Model
    const rawPosition = await getPositionById(positionId);

    // 3. Validasi Not Found
    if (!rawPosition) {
      return res.status(404).json({
        status: "03",
        message: "Posisi tidak ditemukan",
        datetime: datetime,
      });
    }

    // 4. [PERBAIKAN] Formatting Ulang Objek agar urutannya Sesuai Request
    const formattedPosition = {
      id: rawPosition.id,
      position_code: rawPosition.position_code,
      division_code: rawPosition.division_code,

      // Pindahkan field ini ke atas sesuai request
      department_code: rawPosition.department_code,
      division_name: rawPosition.division_name,

      parent_position_code: rawPosition.parent_position_code,
      parent_position_name: rawPosition.parent_position_name, // Pindahkan ke sini

      name: rawPosition.name,
      base_salary: parseFloat(rawPosition.base_salary), // Pastikan jadi Number/Float
      sort_order: rawPosition.sort_order,
      description: rawPosition.description,
      created_at: rawPosition.created_at,
      updated_at: rawPosition.updated_at,
    };

    // 5. Response Sukses
    return res.status(200).json({
      status: "00",
      message: "Data Posisi Berhasil Didapatkan",
      datetime: datetime,
      positions: formattedPosition, // Kirim objek yang sudah dirapikan
    });
  } catch (error) {
    const dbError = error as unknown;
    appLogger.error(`Error fetching position by id: ${dbError}`);
    return res.status(500).json({
      status: "01",
      message: "Terjadi kesalahan pada server",
    });
  }
};
