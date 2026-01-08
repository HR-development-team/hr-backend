import { db } from "@database/connection.js";
import { isPositionNameExist } from "./position.helper.js";
import { addMasterPosition } from "./position.model.js";
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
  const isDuplicate = await isPositionNameExist(null, null, payload.name);

  if (isDuplicate) {
    throw new ServiceError("Nama jabatan sudah ada di level office", 400);
  }

  const newPosition = await addMasterPosition({
    department_code: null,
    division_code: null,
    parent_position_code: payload.parent_position_code || null,
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
 * Create Department Position service
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
  // 1. Ambil Data Department + Info Leader Office (Logic Otomatisasi)
  const parentDepartment = await db(DEPARTMENT_TABLE)
    .leftJoin(
      OFFICE_TABLE,
      `${DEPARTMENT_TABLE}.office_code`,
      `${OFFICE_TABLE}.office_code`
    )
    .select(
      `${DEPARTMENT_TABLE}.*`,
      `${OFFICE_TABLE}.leader_position_code as office_leader_code`
    )
    .where(`${DEPARTMENT_TABLE}.department_code`, payload.department_code)
    .first();

  if (!parentDepartment) {
    throw new ServiceError("Departemen tidak ditemukan", 404);
  }

  // 2. Cek Permission (User boleh gak akses dept ini?)
  const isAllowed = await checkOfficeScope(
    userOfficeCode,
    parentDepartment.office_code
  );
  if (!isAllowed) {
    throw new ServiceError("Anda tidak memiliki akses ke departemen ini", 403);
  }

  // 3. Cek Duplikasi Nama (Dept Level)
  const isDuplicate = await isPositionNameExist(
    payload.department_code,
    null,
    payload.name
  );

  if (isDuplicate) {
    throw new ServiceError("Nama jabatan sudah ada di departemen ini", 400);
  }

  // 4. Logic Otomatisasi Parent (Jika user tidak isi, ambil dari Office Leader)
  let finalParent = payload.parent_position_code;
  if (!finalParent && parentDepartment.office_leader_code) {
    finalParent = parentDepartment.office_leader_code;
  }

  const newPosition = await addMasterPosition({
    department_code: payload.department_code,
    division_code: null,
    parent_position_code: finalParent || null,
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
  // 1. Ambil Data Divisi + Join Dept untuk cari Leader Dept
  const parentDivision = await db(DIVISION_TABLE)
    .leftJoin(
      DEPARTMENT_TABLE,
      `${DIVISION_TABLE}.department_code`,
      `${DEPARTMENT_TABLE}.department_code`
    )
    .select(
      `${DIVISION_TABLE}.*`,
      `${DEPARTMENT_TABLE}.leader_position_code as dept_leader_code`,
      `${DEPARTMENT_TABLE}.office_code as parent_office_code`
    )
    .where(`${DIVISION_TABLE}.division_code`, payload.division_code)
    .first();

  if (!parentDivision) {
    throw new ServiceError("Divisi tidak ditemukan", 404);
  }

  // 2. Cek Permission (Lewat Dept -> Office)
  const isAllowed = await checkOfficeScope(
    userOfficeCode,
    parentDivision.parent_office_code
  );
  if (!isAllowed) {
    throw new ServiceError("Anda tidak memiliki akses ke divisi ini", 403);
  }

  // 3. Cek Duplikasi Nama (Div Level)
  // Ambil dept_code dari hasil query diatas
  const deptCode = parentDivision.department_code;
  const isDuplicate = await isPositionNameExist(
    deptCode,
    payload.division_code,
    payload.name
  );

  if (isDuplicate) {
    throw new ServiceError("Nama jabatan sudah ada di divisi ini", 400);
  }

  // 4. Logic Otomatisasi Parent (Ambil dari Dept Leader)
  let finalParent = payload.parent_position_code;
  if (!finalParent && parentDivision.dept_leader_code) {
    finalParent = parentDivision.dept_leader_code;
  }

  // 5. Insert
  const newPosition = await addMasterPosition({
    department_code: deptCode, // Auto-filled
    division_code: payload.division_code,
    parent_position_code: finalParent || null,
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
 * Create Standard Position service
 */
export const createGeneralPositionService = async (
  userOfficeCode: string, // User yang login
  payload: {
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

  // ==========================================
  // 1. VALIDASI HIERARKI & PERMISSION
  // ==========================================

  // KASUS A: Level Divisi (Staff / Team Lead)
  if (division_code) {
    const parentDivision = await db(DIVISION_TABLE)
      .join(
        DEPARTMENT_TABLE,
        `${DIVISION_TABLE}.department_code`,
        `${DEPARTMENT_TABLE}.department_code`
      )
      .select(
        `${DIVISION_TABLE}.*`,
        `${DEPARTMENT_TABLE}.office_code as parent_office_code`,
        `${DEPARTMENT_TABLE}.leader_position_code as dept_leader_code` // Ambil Leader Dept
      )
      .where(`${DIVISION_TABLE}.division_code`, division_code)
      .first();

    if (!parentDivision) {
      throw new ServiceError("Divisi tidak ditemukan", 404);
    }

    // Konsistensi Check: Kalau user kirim dept_code juga, harus cocok
    if (department_code && parentDivision.department_code !== department_code) {
      throw new ServiceError(
        "Divisi ini tidak berada di departemen yang dipilih",
        400
      );
    }

    // Cek Permission User
    const isAllowed = await checkOfficeScope(
      userOfficeCode,
      parentDivision.parent_office_code
    );
    if (!isAllowed) {
      throw new ServiceError("Anda tidak memiliki akses ke divisi ini", 403);
    }

    // Auto-fill Dept Code
    finalDeptCode = parentDivision.department_code;

    // Auto-Parent Logic: Jika kosong, arahkan ke Dept Leader
    if (!finalParentCode && parentDivision.dept_leader_code) {
      finalParentCode = parentDivision.dept_leader_code;
    }
  }

  // KASUS B: Level Department (Head of Dept)
  else if (department_code) {
    const parentDepartment = await db(DEPARTMENT_TABLE)
      .join(
        OFFICE_TABLE,
        `${DEPARTMENT_TABLE}.office_code`,
        `${OFFICE_TABLE}.office_code`
      )
      .select(
        `${DEPARTMENT_TABLE}.*`,
        `${OFFICE_TABLE}.leader_position_code as office_leader_code` // Ambil Leader Office
      )
      .where(`${DEPARTMENT_TABLE}.department_code`, department_code)
      .first();

    if (!parentDepartment) {
      throw new ServiceError("Departemen tidak ditemukan", 404);
    }

    // Cek Permission User
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

    // Auto-Parent Logic: Jika kosong, arahkan ke Office Leader
    if (!finalParentCode && parentDepartment.office_leader_code) {
      finalParentCode = parentDepartment.office_leader_code;
    }
  }

  // KASUS C: Level Office (CEO / Branch Manager)
  // Dept & Div kosong -> Tidak perlu cek parent unit, langsung cek duplikasi saja.

  // ==========================================
  // 2. CEK DUPLIKASI NAMA
  // ==========================================
  const isDuplicate = await isPositionNameExist(
    finalDeptCode, // Gunakan dept code yang sudah dipastikan,
    division_code || null,
    name
  );

  if (isDuplicate) {
    throw new ServiceError("Nama jabatan sudah ada di unit kerja ini", 400);
  }

  // ==========================================
  // 3. INSERT DATABASE
  // ==========================================
  return await addMasterPosition({
    department_code: finalDeptCode,
    division_code: division_code || null,
    parent_position_code: finalParentCode,
    name,
    base_salary,
    description,
  });
};
