import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("master_divisions").insert([
    {
      division_code: "D-TEK-BE",
      department_code: "TEK",
      name: "Backend",
      description: "Tim backend developer.",
    },
    {
      division_code: "D-TEK-FE",
      department_code: "TEK",
      name: "Frontend",
      description: "Tim frontend developer.",
    },
    {
      division_code: "D-HR-PAY",
      department_code: "HR",
      name: "Payroll & Admin",
      description: "Tim yang mengurus gaji dan administrasi",
    },
  ]);
}
