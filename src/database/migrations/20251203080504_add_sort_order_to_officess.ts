import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("master_offices", function (table) {
    // Tambahkan kolom sort_order (Integer), default 1
    table.integer("sort_order").defaultTo(1);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("master_offices", function (table) {
    table.dropColumn("sort_order");
  });
}
