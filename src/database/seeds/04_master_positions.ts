import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("master_positions").insert([
    {
      position_code: "P-BE-JR",
      division_code: "D-TEK-BE",
      name: "Junior Backend Developer",
      base_salary: 800000,
    },
    {
      position_code: "P-FE-SR",
      division_code: "D-TEK-FE",
      name: "Senior Frontend Developer",
      base_salary: 1500000,
    },
    {
      position_code: "P-HR-STAFF",
      division_code: "D-HR-PAY",
      name: "HR Staff",
      base_salary: 7500000,
    },
  ]);
}
