import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("payroll_periods").insert([
    {
      period_code: "PRD-JAN25",
      start_date: "2025-01-01",
      end_date: "2025-01-31",
    },
    {
      period_code: "PRD-FEB25",
      start_date: "2025-02-01",
      end_date: "2025-02-28",
    },
  ]);
}
