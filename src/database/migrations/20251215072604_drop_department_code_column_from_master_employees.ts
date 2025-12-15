import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("master_employees", (table) => {
    table.dropForeign(
      ["department_code"],
      "master_employees_department_code_foreign"
    );

    table.dropColumn("department_code");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("master_employees", (table) => {
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
