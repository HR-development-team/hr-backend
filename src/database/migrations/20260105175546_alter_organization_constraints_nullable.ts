import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .alterTable("master_divisions", (table) => {
      table.string("department_code", 10).nullable().alter();
    })
    .alterTable("master_positions", (table) => {
      table.string("division_code", 10).nullable().alter();
      table.string("department_code", 10).nullable().alter;

      table
        .foreign("department_code")
        .references("department_code")
        .inTable("master_departments")
        .onUpdate("CASCADE")
        .onDelete("SET NULL");
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw("SET FOREIGN_KEY_CHECKS = 0");

  await knex("master_positions")
    .whereNull("division_code")
    .orWhereNull("department_code")
    .del();

  await knex.raw("SET FOREIGN_KEY_CHECKS = 1");

  await knex.schema
    .alterTable("master_divisions", (table) => {
      table.string("department_code", 10).notNullable().alter();
    })
    .alterTable("master_positions", (table) => {
      table.dropForeign("department_code");

      table.dropColumn("department_code");
      table.string("division_code", 10).notNullable().alter();
    });
}
