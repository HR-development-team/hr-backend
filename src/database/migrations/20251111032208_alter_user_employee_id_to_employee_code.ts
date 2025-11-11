import type { Knex } from "knex";

const USERS_TABLE = "users";
const EMPLOYEES_TABLE = "master_employees";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(USERS_TABLE, (table) => {
    table.dropForeign(["employee_id"], "users_employee_id_foreign");
  });

  await knex.schema.alterTable(USERS_TABLE, (table) => {
    table.dropColumn("employee_id");
  });

  await knex.schema.alterTable(USERS_TABLE, (table) => {
    table.string("user_code", 10).notNullable().unique().after("id");
    table
      .string("employee_code", 10)
      .references("employee_code")
      .inTable(EMPLOYEES_TABLE)
      .onDelete("RESTRICT")
      .unique()
      .notNullable()
      .after("password");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(USERS_TABLE, (table) => {
    table.dropForeign(["employee_code"]);
    table.dropColumn("employee_code");
    table.dropColumn("user_code");
  });

  await knex.schema.alterTable(EMPLOYEES_TABLE, (table) => {
    table
      .integer("employee_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable(EMPLOYEES_TABLE)
      .onDelete("RESTRICT");
  });
}
