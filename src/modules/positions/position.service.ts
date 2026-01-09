import { db } from "@database/connection.js";
import { isPositionNameExist } from "./position.helper.js";
import {
  addMasterPosition,
  getDepartmentHierarchyInfo,
  getDivisionHierarchyInfo,
  getOfficeHierarchyInfo,
  getParentOffice,
} from "./position.model.js";
import {
  DEPARTMENT_TABLE,
  DIVISION_TABLE,
  OFFICE_TABLE,
} from "@common/constants/database.js";
import { checkOfficeScope } from "@modules/offices/office.helper.js";

export class ServiceError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Create Office Position service
 */
export const createOfficePositionService = async (payload: {
  office_code: string;
  name: string;
  base_salary: number;
  description?: string;
  parent_position_code?: string | null;
}) => {
  const targetOffice = await getOfficeHierarchyInfo(payload.office_code);

  if (!targetOffice) {
    throw new ServiceError("Kantor tidak ditemukan", 404);
  }

  if (targetOffice.leader_position_code) {
    throw new ServiceError(
      `Kantor '${targetOffice.name}' sudah memiliki Kepala Kantor (Jabatan Terkait: ${targetOffice.leader_position_code}). Tidak bisa membuat jabatan kepala baru.`,
      400
    );
  }

  let finalParentPositionCode = payload.parent_position_code || null;

  if (targetOffice.parent_office_code) {
    const parentOffice = await getParentOffice(targetOffice.parent_office_code);

    if (!parentOffice) {
      throw new ServiceError(
        "Data Parent Office tidak ditemukan (Inkonsistensi Data)",
        500
      );
    }

    if (!parentOffice.leader_position_code) {
      throw new ServiceError(
        `Gagal membuat jabatan. Kantor Induk '${parentOffice.name}' belum memiliki Kepala Kantor. Harap buat jabatan kepala untuk kantor induk terlebih dahulu.`,
        400
      );
    }

    // Auto-link hierarchy
    finalParentPositionCode = parentOffice.leader_position_code;
  }

  const isDuplicate = await isPositionNameExist(null, null, payload.name);
  if (isDuplicate) {
    throw new ServiceError("Nama jabatan sudah ada di level office", 400);
  }

  const newPosition = await addMasterPosition({
    office_code: payload.office_code,
    department_code: null,
    division_code: null,
    parent_position_code: finalParentPositionCode,
    name: payload.name,
    base_salary: payload.base_salary,
    description: payload.description,
  });

  await db(OFFICE_TABLE).where("office_code", payload.office_code).update({
    leader_position_code: newPosition.position_code,
    updated_at: new Date(),
  });

  return newPosition;
};

/**
 * Create Department Position service (For Dept Heads)
 */
export const createDepartmentPositionService = async (
  userOfficeCode: string,
  payload: {
    department_code: string;
    name: string;
    base_salary: number;
    description?: string;
    parent_position_code?: string | null;
  }
) => {
  const targetDept = await getDepartmentHierarchyInfo(payload.department_code);

  if (!targetDept) {
    throw new ServiceError("Departemen tidak ditemukan", 404);
  }

  if (targetDept.leader_position_code) {
    throw new ServiceError(
      `Departemen '${targetDept.name}' sudah memiliki Kepala Departemen. Tidak bisa membuat kepala baru.`,
      400
    );
  }

  // Check if the logged-in user is allowed to manage this department's office
  const isAllowed = await checkOfficeScope(
    userOfficeCode,
    targetDept.office_code
  );
  if (!isAllowed) {
    throw new ServiceError("Anda tidak memiliki akses ke departemen ini", 403);
  }

  // Fetch the Office that owns this department
  const parentOffice = await getOfficeHierarchyInfo(targetDept.office_code);

  if (!parentOffice) {
    throw new ServiceError(
      "Data Office tidak ditemukan (Inkonsistensi Data)",
      500
    );
  }

  // CONSTRAINT: The Office must have a leader (CEO/Branch Manager)
  if (!parentOffice.leader_position_code) {
    throw new ServiceError(
      `Gagal membuat jabatan. Kantor '${parentOffice.name}' belum memiliki Kepala Kantor. Departemen ini tidak bisa memiliki kepala sebelum kantornya memiliki kepala.`,
      400
    );
  }

  // AUTO-LINK: Dept Head reports to Office Head
  const finalParentPositionCode = parentOffice.leader_position_code;

  const isDuplicate = await isPositionNameExist(
    payload.department_code,
    null,
    payload.name
  );

  if (isDuplicate) {
    throw new ServiceError("Nama jabatan sudah ada di departemen ini", 400);
  }

  const newPosition = await addMasterPosition({
    office_code: targetDept.office_code,
    department_code: payload.department_code,
    division_code: null,
    parent_position_code: finalParentPositionCode,
    name: payload.name,
    base_salary: payload.base_salary,
    description: payload.description,
  });

  await db(DEPARTMENT_TABLE)
    .where("department_code", payload.department_code)
    .update({
      leader_position_code: newPosition.position_code,
      updated_at: new Date(),
    });

  return newPosition;
};

/**
 * Create Division Position service
 */
export const createDivisionPositionService = async (
  userOfficeCode: string,
  payload: {
    division_code: string;
    name: string;
    base_salary: number;
    description?: string;
    parent_position_code?: string | null;
  }
) => {
  const targetDiv = await getDivisionHierarchyInfo(payload.division_code);

  if (!targetDiv) {
    throw new ServiceError("Divisi tidak ditemukan", 404);
  }

  if (targetDiv.leader_position_code) {
    throw new ServiceError(
      `Divisi '${targetDiv.name}' sudah memiliki Kepala Divisi. Tidak bisa membuat kepala baru.`,
      400
    );
  }

  // Fetch the Department that owns this division
  const parentDept = await getDepartmentHierarchyInfo(
    targetDiv.department_code
  );

  if (!parentDept) {
    throw new ServiceError(
      "Data Departemen tidak ditemukan (Inkonsistensi Data)",
      500
    );
  }

  // We use the office_code found in the parent Department
  const isAllowed = await checkOfficeScope(
    userOfficeCode,
    parentDept.office_code
  );
  if (!isAllowed) {
    throw new ServiceError("Anda tidak memiliki akses ke divisi ini", 403);
  }

  // CONSTRAINT: The Department must have a leader
  if (!parentDept.leader_position_code) {
    throw new ServiceError(
      `Gagal membuat jabatan. Departemen '${parentDept.name}' belum memiliki Kepala Departemen. Divisi ini tidak bisa memiliki kepala sebelum departemennya memiliki kepala.`,
      400
    );
  }

  // AUTO-LINK: Div Head reports to Dept Head
  const finalParentPositionCode = parentDept.leader_position_code;
  const isDuplicate = await isPositionNameExist(
    parentDept.department_code,
    payload.division_code,
    payload.name
  );

  if (isDuplicate) {
    throw new ServiceError("Nama jabatan sudah ada di divisi ini", 400);
  }

  const newPosition = await addMasterPosition({
    office_code: parentDept.office_code,
    department_code: parentDept.department_code,
    division_code: payload.division_code,
    parent_position_code: finalParentPositionCode,
    name: payload.name,
    base_salary: payload.base_salary,
    description: payload.description,
  });

  await db(DIVISION_TABLE)
    .where("division_code", payload.division_code)
    .update({
      leader_position_code: newPosition.position_code,
      updated_at: new Date(),
    });

  return newPosition;
};

/**
 * Create Standard Position service (General Staff)
 */
export const createGeneralPositionService = async (
  userOfficeCode: string,
  payload: {
    office_code?: string | null;
    department_code?: string | null;
    division_code?: string | null;
    parent_position_code?: string | null;
    name: string;
    base_salary: number;
    description?: string;
  }
) => {
  const {
    division_code,
    department_code,
    parent_position_code,
    name,
    base_salary,
    description,
  } = payload;

  let finalDeptCode = department_code || null;
  let finalParentCode = parent_position_code || null;
  let finalOfficeCode = payload.office_code || null;

  if (division_code) {
    const parentDivision = await db(DIVISION_TABLE)
      .join(
        DEPARTMENT_TABLE,
        `${DIVISION_TABLE}.department_code`,
        `${DEPARTMENT_TABLE}.department_code`
      )
      .select(
        `${DIVISION_TABLE}.*`, // Includes division leader_position_code
        `${DEPARTMENT_TABLE}.office_code as parent_office_code`
      )
      .where(`${DIVISION_TABLE}.division_code`, division_code)
      .first();

    if (!parentDivision) {
      throw new ServiceError("Divisi tidak ditemukan", 404);
    }

    // Validation: Match Department
    if (department_code && parentDivision.department_code !== department_code) {
      throw new ServiceError(
        "Divisi ini tidak berada di departemen yang dipilih",
        400
      );
    }

    // Permission Check
    const isAllowed = await checkOfficeScope(
      userOfficeCode,
      parentDivision.parent_office_code
    );
    if (!isAllowed) {
      throw new ServiceError("Anda tidak memiliki akses ke divisi ini", 403);
    }

    if (!parentDivision.leader_position_code) {
      throw new ServiceError(
        `Divisi '${parentDivision.name}' belum memiliki Kepala Divisi. Harap buat Kepala Divisi terlebih dahulu sebelum menambah staff.`,
        400
      );
    }

    // Auto-Set Context
    finalDeptCode = parentDivision.department_code;
    finalOfficeCode = parentDivision.parent_office_code;

    // Auto-Parenting: Staff reports to Division Leader
    if (!finalParentCode) {
      finalParentCode = parentDivision.leader_position_code;
    }
  } else if (department_code) {
    const parentDepartment = await db(DEPARTMENT_TABLE)
      .join(
        OFFICE_TABLE,
        `${DEPARTMENT_TABLE}.office_code`,
        `${OFFICE_TABLE}.office_code`
      )
      .select(
        `${DEPARTMENT_TABLE}.*`, // Includes department leader_position_code
        `${OFFICE_TABLE}.office_code`
      )
      .where(`${DEPARTMENT_TABLE}.department_code`, department_code)
      .first();

    if (!parentDepartment) {
      throw new ServiceError("Departemen tidak ditemukan", 404);
    }

    // Permission Check
    const isAllowed = await checkOfficeScope(
      userOfficeCode,
      parentDepartment.office_code
    );
    if (!isAllowed) {
      throw new ServiceError(
        "Anda tidak memiliki akses ke departemen ini",
        403
      );
    }

    if (!parentDepartment.leader_position_code) {
      throw new ServiceError(
        `Departemen '${parentDepartment.name}' belum memiliki Kepala Departemen. Harap buat Kepala Departemen terlebih dahulu.`,
        400
      );
    }

    finalOfficeCode = parentDepartment.office_code;

    // Auto-Parenting: Staff reports to Department Leader
    if (!finalParentCode) {
      finalParentCode = parentDepartment.leader_position_code;
    }
  } else if (finalOfficeCode) {
    // We need to fetch the office to check for the leader
    const parentOffice = await db(OFFICE_TABLE)
      .where("office_code", finalOfficeCode)
      .select("leader_position_code", "name")
      .first();

    if (!parentOffice) {
      throw new ServiceError("Kantor tidak ditemukan", 404);
    }

    // Permission Check
    const isAllowed = await checkOfficeScope(userOfficeCode, finalOfficeCode);
    if (!isAllowed) {
      throw new ServiceError("Anda tidak memiliki akses ke kantor ini", 403);
    }

    if (!parentOffice.leader_position_code) {
      throw new ServiceError(
        `Kantor '${parentOffice.name}' belum memiliki Kepala Kantor. Harap buat Kepala Kantor terlebih dahulu.`,
        400
      );
    }

    // Auto-Parenting: Staff reports to Office Leader (CEO/Branch Mgr)
    if (!finalParentCode) {
      finalParentCode = parentOffice.leader_position_code;
    }
  } else {
    throw new ServiceError(
      "Kode Kantor (Office Code) wajib diisi jika tanpa Dept/Divisi",
      400
    );
  }

  const isDuplicate = await isPositionNameExist(
    finalDeptCode,
    division_code || null,
    name
  );

  if (isDuplicate) {
    throw new ServiceError("Nama jabatan sudah ada di unit kerja ini", 400);
  }

  return await addMasterPosition({
    office_code: finalOfficeCode,
    department_code: finalDeptCode,
    division_code: division_code || null,
    parent_position_code: finalParentCode,
    name,
    base_salary,
    description,
  });
};
