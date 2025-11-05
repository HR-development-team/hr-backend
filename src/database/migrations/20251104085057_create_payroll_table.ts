import type { Knex } from "knex";

const PAYROLLS_TABLE = "payrolls";
const PERIODS_TABLE = "payroll_periods";
const EMPLOYEES_TABLE = "master_employees";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(PAYROLLS_TABLE, (table) => {
    table.increments("id").primary();

    table
      .integer("payroll_period_id")
      .unsigned()
      .references("id")
      .inTable(PERIODS_TABLE)
      .onDelete("CASCADE")
      .notNullable();

    table
      .integer("employee_id")
      .unsigned()
      .references("id")
      .inTable(EMPLOYEES_TABLE)
      .onDelete("CASCADE")
      .notNullable();

    table.integer("base_salary").notNullable();
    table.integer("total_work_days").notNullable();
    table.integer("total_leave_days").notNullable();
    table.integer("total_deductions").notNullable().defaultTo(0);
    table.integer("net_salary").notNullable();

    table.dateTime("generated_at").notNullable();
    table
      .enum("status", ["draft", "finalized", "paid"])
      .notNullable()
      .defaultTo("draft");

    table.unique(["payroll_period_id", "employee_id"]);

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(PAYROLLS_TABLE);
}
