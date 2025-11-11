import type { Knex } from "knex";
const EMPLOYEES_TABLE = "master_employees";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(EMPLOYEES_TABLE, (table) => {
    table.string("employment_status", 50).nullable().defaultTo("aktif").alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(EMPLOYEES_TABLE, (table) => {
    table.string("employment_status", 50).nullable().alter();
  });
}
