import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("master_employees", (table) => {
    table.string("shift_code", 10).nullable();

    table
      .foreign("shift_code")
      .references("shift_code")
      .inTable("master_shifts")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("master_employees", (table) => {
    table.dropForeign(["shift_code"]);
    table.dropColumn("shift_code");
  });
}
