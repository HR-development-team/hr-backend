import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("attendances", (table) => {
    table.string("attendance_code", 50).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("attendances", (table) => {
    table.string("attendance_code", 20).alter();
  });
}
