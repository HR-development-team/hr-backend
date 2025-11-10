import type { Knex } from "knex";

const DIVISIONS_TABLE = "master_divisions";
const DEPARTMENT_TABLE = "master_departments";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(DIVISIONS_TABLE, (table) => {
    table.increments("id").primary();
    table.string("division_code", 10).notNullable().unique();
    table
      .string("department_code", 10)
      .references("department_code")
      .inTable(DEPARTMENT_TABLE)
      .onDelete("RESTRICT")
      .notNullable();
    table.string("name", 100).notNullable();
    table.text("description").nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(DIVISIONS_TABLE);
}
