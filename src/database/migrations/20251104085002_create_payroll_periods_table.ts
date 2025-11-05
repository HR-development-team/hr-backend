import type { Knex } from "knex";

const PERIODS_TABLE = "payroll_periods";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(PERIODS_TABLE, (table) => {
    table.increments("id").primary();
    table.string("period_code", 20).notNullable().unique();
    table.date("start_date").notNullable();
    table.date("end_date").notNullable();
    table
      .enum("status", ["open", "processing", "finalized", "paid", "canceled"])
      .notNullable()
      .defaultTo("open");
    table.unique(["start_date", "end_date"]);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(PERIODS_TABLE);
}
