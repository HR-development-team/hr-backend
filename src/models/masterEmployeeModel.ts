import { db as knex } from "core/config/knex.js"; // Sesuaikan path ke koneksi Knex Anda
import {
  CreateMasterEmployeeData, // Asumsi nama tipe dari skema
  UpdateEmployeeData, // Impor dari skema/tipe
} from "@schemas/masterEmployeeSchema.js"; // Sesuaikan path jika perlu
// Import tipe lain yang mungkin Anda perlukan dari employeeTypes
import { Employee } from "types/employeeTypes.js"; // Pastikan path ini benar

// --- Definisi Nama Tabel ---
const EMPLOYEE_TABLE = "master_employees";
const POSITION_TABLE = "master_positions";
const DEPARTMENT_TABLE = "master_departments";

// --- Kolom Pilihan untuk JOINS ---
// Ini akan mengambil semua data karyawan + nama posisi & departemen
const employeeSelectFields = [
  `${EMPLOYEE_TABLE}.id`,
  `${EMPLOYEE_TABLE}.first_name`,
  `${EMPLOYEE_TABLE}.last_name`,
  `${EMPLOYEE_TABLE}.contact_phone`,
  `${EMPLOYEE_TABLE}.address`,
  `${EMPLOYEE_TABLE}.join_date`,
  `${EMPLOYEE_TABLE}.position_id`,
  `${EMPLOYEE_TABLE}.created_at`,
  `${EMPLOYEE_TABLE}.updated_at`,
  `${POSITION_TABLE}.name as position_name`,
  `${POSITION_TABLE}.department_id`,
  `${DEPARTMENT_TABLE}.name as department_name`,
];

/**
 * Helper internal untuk join tabel
 */
const queryBuilder = () => {
  return knex(EMPLOYEE_TABLE)
    .join(
      POSITION_TABLE,
      `${EMPLOYEE_TABLE}.position_id`,
      "=",
      `${POSITION_TABLE}.id`
    )
    .join(
      DEPARTMENT_TABLE,
      `${POSITION_TABLE}.department_id`,
      "=",
      `${DEPARTMENT_TABLE}.id`
    );
};

/**
 * [GET] Mengambil semua karyawan
 */
export const getAllMasterEmployees = async (): Promise<Employee[]> => {
  return queryBuilder().select(employeeSelectFields);
};

/**
 * [GET BY ID] Mengambil satu karyawan berdasarkan ID
 */
export const getMasterEmployeesById = async (
  id: number
): Promise<Employee | null> => {
  const employee = await queryBuilder()
    .select(employeeSelectFields)
    .where(`${EMPLOYEE_TABLE}.id`, id)
    .first(); // .first() untuk mengambil 1 objek, bukan array

  return employee || null;
};

/**
 * [POST] Menambahkan karyawan baru
 */
// KODE BARU YANG BENAR (UNTUK MYSQL)
export const addMasterEmployees = async (
  data: CreateMasterEmployeeData
): Promise<Employee | null> => {

  // 1. Lakukan insert. Hasilnya adalah array [insertId]
  const [insertId] = await knex(EMPLOYEE_TABLE).insert(data);

  // 2. Cek apakah insertId valid (bukan 0 atau undefined)
  if (!insertId) {
    throw new Error("Gagal membuat karyawan, tidak ada ID yang dikembalikan dari database.");
  }

  // 3. Gunakan 'insertId' yang valid untuk mengambil data lengkap
  const newEmployee = await getMasterEmployeesById(insertId);
  return newEmployee;
};

/**
 * [PUT] Mengedit karyawan berdasarkan ID
 * --- INI ADALAH FUNGSI YANG DIPERBAIKI ---
 */
export const editMasterEmployees = async (
  id: number,
  data: UpdateEmployeeData
): Promise<Employee | null> => {
  // 'id' dan 'data' sekarang terpisah, error TypeScript hilang
  const affectedRows = await knex(EMPLOYEE_TABLE)
    .where({ id: id })
    .update(data);

  if (affectedRows === 0) {
    return null; // Karyawan tidak ditemukan
  }

  // Kembalikan data karyawan yang sudah diupdate (lengkap dengan join)
  return getMasterEmployeesById(id);
};

/**
 * [DELETE] Menghapus karyawan berdasarkan ID
 */
export const removeMasterEmployees = async (
  id: number
): Promise<number | null> => {
  const affectedRows = await knex(EMPLOYEE_TABLE).where({ id: id }).del();

  if (affectedRows === 0) {
    return null; // Karyawan tidak ditemukan
  }
  return affectedRows;
};
