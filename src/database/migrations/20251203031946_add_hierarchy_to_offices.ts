// FILE: src/database/migrations/2025xxxx_add_hierarchy_to_offices.ts
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("master_offices", function (table) {
    // 1. Ubah jadi STRING (bukan integer) dan beri nama parent_office_code
    table.string("parent_office_code").nullable().index();

    table.text("description").nullable();

    // 2. Arahkan Foreign Key ke "office_code"
    table
      .foreign("parent_office_code")
      .references("office_code") // <--- Arahkan ke sini
      .inTable("master_offices")
      .onDelete("SET NULL");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("master_offices", function (table) {
    table.dropForeign("parent_office_code");
    table.dropColumn("parent_office_code"); // Hapus kolom yang baru
    table.dropColumn("description");
  });
}
