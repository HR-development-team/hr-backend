import type { Knex } from "knex";

const OLD_INDEX_NAME = "attendances_employee_code_session_code_unique";
const NEW_INDEX_NAME = "unique_attendance_per_day";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("attendances", (table) => {
    table.dropForeign(["employee_code"]);

    table.dropUnique([], OLD_INDEX_NAME);

    table.unique(["employee_code", "date"], NEW_INDEX_NAME);

    table
      .foreign("employee_code")
      .references("employee_code")
      .inTable("master_employees")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("attendances", (table) => {
    table.dropForeign(["employee_code"]);

    table.dropUnique(["employee_code", "date"], NEW_INDEX_NAME);

    table
      .foreign("employee_code")
      .references("employee_code")
      .inTable("master_employees");
  });
}
