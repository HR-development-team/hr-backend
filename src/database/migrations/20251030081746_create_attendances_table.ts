import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("attendances", (table) => {
    table.increments("id").primary();
    table
      .integer("employee_id")
      .unsigned()
      .references("id")
      .inTable("master_employees")
      .onDelete("CASCADE")
      .notNullable();
    table.date("work_date").notNullable();
    table.dateTime("check_in_time").notNullable();
    table.dateTime("check_out_time").nullable();
    table.unique(["employee_id", "work_date"]);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("attendances");
}
