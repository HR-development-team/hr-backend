import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("master_divisions").insert([
    {
      division_code: "DVS0000001",
      department_code: "DPT0000001", // Sebelumnya "TEK"
      name: "Backend Engineering", // Sebelumnya "Backend"
      description: "Divisions of Backend Engineering",
    },
    {
      division_code: "DVS0000002",
      department_code: "DPT0000001", // Sebelumnya "TEK"
      name: "Frontend Engineering", // Sebelumnya "Frontend"
      description: "Divisions of Frontend Engineering",
    },
    {
      division_code: "DVS0000003",
      department_code: "DPT0000002", // Sebelumnya "HR"
      name: "Payroll & Admin",
      description: "Divisions of Payroll & Admin",
    },
  ]);
}
