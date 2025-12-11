import type { Knex } from "knex";

const TABLE_NAME = "master_employees";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TABLE_NAME, (table) => {
    // 1. Tambah Kolom department_code
    table
      .string("department_code", 20) // Sesuaikan panjang string dengan tabel master_departments
      .nullable() // Boleh kosong dulu biar aman
      .after("office_code") // Letakkan setelah office_code biar rapi
      .comment("Foreign Key ke tabel master_departments");

    // 2. Tambah Relasi (Foreign Key)
    table
      .foreign("department_code")
      .references("department_code")
      .inTable("master_departments")
      .onDelete("SET NULL") // Jika departemen dihapus, karyawan tidak ikut terhapus (hanya jadi null)
      .onUpdate("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TABLE_NAME, (table) => {
    // Hapus FK dan Kolom jika rollback
    table.dropForeign(["department_code"]);
    table.dropColumn("department_code");
  });
}
