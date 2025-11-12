import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("payroll_periods").insert([
    {
      period_code: "NOV2025",
      start_date: "2025-11-01",
      end_date: "2025-11-30",
      status: "open",
    },
    {
      period_code: "OKT2025",
      start_date: "2025-10-01",
      end_date: "2025-10-31",
      status: "paid",
    },
  ]);
}
