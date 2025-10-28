import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable("departments", "master_departments");
  await knex.schema.renameTable("positions", "master_positions");
  await knex.schema.renameTable("leave_types", "master_leave_types");
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.renameTable("master_departments", "departments");
  await knex.schema.renameTable("master_positions", "positions");
  await knex.schema.renameTable("master_leave_types", "leave_types");
}
