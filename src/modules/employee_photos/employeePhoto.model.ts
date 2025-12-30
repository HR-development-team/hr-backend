// employeePhoto.model.ts
import { db } from "@database/connection.js";
import type { EmployeePhoto } from "./employeePhoto.types.js";

const TABLE_NAME = "employee_photos";

export const EmployeePhotoModel = {
  // Upload atau update foto
  async upsert(
    employee_code: string,
    filename: string,
    file_path: string,
    mimetype: string,
    file_size: number
  ): Promise<void> {
    const exists = await db(TABLE_NAME).where({ employee_code }).first();

    if (exists) {
      // Update foto yang sudah ada
      await db(TABLE_NAME).where({ employee_code }).update({
        filename,
        file_path,
        mimetype,
        file_size,
        updated_at: db.fn.now(),
      });
    } else {
      // Insert foto baru
      await db(TABLE_NAME).insert({
        employee_code,
        filename,
        file_path,
        mimetype,
        file_size,
      });
    }
  },

  // Ambil foto by employee_code
  async findByEmployeeCode(
    employee_code: string
  ): Promise<EmployeePhoto | null> {
    const result = await db(TABLE_NAME).where({ employee_code }).first();

    return result || null;
  },

  // Hapus foto
  async delete(employee_code: string): Promise<boolean> {
    const deleted = await db(TABLE_NAME).where({ employee_code }).delete();

    return deleted > 0;
  },

  // Cek apakah foto exists
  async exists(employee_code: string): Promise<boolean> {
    const result = await db(TABLE_NAME)
      .where({ employee_code })
      .count("id as count")
      .first();

    return (result?.count as number) > 0;
  },
};
