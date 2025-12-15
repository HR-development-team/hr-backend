import type { Knex } from "knex";

const TABLE_NAME = "master_employees";
// Kita pakai definisi konstanta dari Incoming Change agar lebih rapi
const COLUMN_NAME = "department_code";
const CONSTRAINT_NAME = "master_employees_department_code_foreign";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TABLE_NAME, (table) => {
    // 1. Tambah Kolom department_code
    table
      .string(COLUMN_NAME, 20) // Menggunakan variabel konstanta
      .nullable()
      .after("office_code")
      .comment("Foreign Key ke tabel master_departments");

    // 2. Tambah Relasi (Foreign Key)
    table
      .foreign(COLUMN_NAME)
      .references("department_code")
      .inTable("master_departments")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  // Kita pakai logika 'Safe Down' dari Incoming Change
  // 1. Coba hapus Foreign Key (bungkus try-catch agar tidak crash jika constraint tidak ada)
  try {
    await knex.schema.alterTable(TABLE_NAME, (table) => {
      table.dropForeign([COLUMN_NAME], CONSTRAINT_NAME);
    });
  } catch (error) {
    // Abaikan error jika foreign key sudah tidak ada
  }

  // 2. Cek dulu apakah kolom ada, baru dihapus (Lebih aman)
  const hasColumn = await knex.schema.hasColumn(TABLE_NAME, COLUMN_NAME);

  if (hasColumn) {
    await knex.schema.alterTable(TABLE_NAME, (table) => {
      table.dropColumn(COLUMN_NAME);
    });
  }
}
