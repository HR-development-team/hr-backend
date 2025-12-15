import type { Knex } from "knex";

const TABLE_NAME = "master_positions";

export async function up(knex: Knex): Promise<void> {
  const hasParentColumn = await knex.schema.hasColumn(
    TABLE_NAME,
    "parent_position_code"
  );
  const hasSortOrder = await knex.schema.hasColumn(TABLE_NAME, "sort_order");

  await knex.schema.alterTable(TABLE_NAME, (table) => {
    // 1. Tambah Parent Position (Jika belum ada)
    if (!hasParentColumn) {
      table
        .string("parent_position_code", 10)
        .nullable()
        .after("division_code"); // Letakkan setelah division_code

      // Tambah Foreign Key ke diri sendiri (Self-Reference)
      table
        .foreign("parent_position_code")
        .references("position_code")
        .inTable(TABLE_NAME)
        .onDelete("SET NULL")
        .onUpdate("CASCADE");
    }

    // 2. Tambah Sort Order (Jika belum ada)
    if (!hasSortOrder) {
      table.integer("sort_order").defaultTo(0).after("base_salary");
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    // Hapus Foreign Key & Kolom jika rollback
    table.dropForeign(["parent_position_code"]);
    table.dropColumn("parent_position_code");
    table.dropColumn("sort_order");
  });
}
