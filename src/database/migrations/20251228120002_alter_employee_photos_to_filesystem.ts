import type { Knex } from "knex";

const EMPLOYEE_PHOTOS_TABLE = "employee_photos";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(EMPLOYEE_PHOTOS_TABLE, (table) => {
    // Hapus kolom photo (LONGBLOB)
    table.dropColumn("photo");

    // Tambah kolom untuk menyimpan path file
    table.string("filename", 255).notNullable().after("employee_code");
    table.string("file_path", 500).notNullable().after("filename");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw("SET FOREIGN_KEY_CHECKS = 0");
  try {
    await knex.schema.alterTable(EMPLOYEE_PHOTOS_TABLE, (table) => {
      // Hapus kolom yang baru ditambahkan
      table.dropColumn("filename");
      table.dropColumn("file_path");

      // Kembalikan kolom photo
      table
        .specificType("photo", "LONGBLOB")
        .notNullable()
        .after("employee_code");
    });
  } catch (error) {
    console.error(`Error during 'down' migration: ${error}`);
    throw error;
  } finally {
    await knex.raw("SET FOREIGN_KEY_CHECKS = 1");
  }
}
