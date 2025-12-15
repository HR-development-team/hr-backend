import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("master_departments").insert([
    {
      department_code: "DPT0000001",
      name: "Technology",
      office_code: "OFC0000001",
      description: "Tech",
    },
    {
      department_code: "DPT0000002",
      name: "Human Resources",
      office_code: "OFC0000001",
      description: "HR",
    },
    {
      department_code: "DPT0000003",
      name: "Sales",
      office_code: "OFC0000002",
      description: "Sales Jatim",
    },
    {
      department_code: "DPT0000004",
      name: "Finance",
      office_code: "OFC0000001",
      description: "Finance",
    },
  ]);
}
