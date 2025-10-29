import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable("employees", "master_employees");
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.renameTable("master_employees", "employees");
}
