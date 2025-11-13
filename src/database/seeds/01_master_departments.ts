import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Hanya insert, .del() sudah diurus oleh 00_delete_all.ts
  await knex("master_departments").insert([
    {
      department_code: "DPT0000001",
      name: "Teknologi",
      description: "Department of Teknologi",
    },
    {
      department_code: "DPT0000002",
      name: "Human Resources",
      description: "Department of Human Resources",
    },
    {
      department_code: "DPT0000003",
      name: "Keuangan",
      description: "Department of Keuangan",
    },
    // Ini adalah data dari contoh JSON Anda
    {
      department_code: "DPT0000004",
      name: "Cleaning Service",
      description: "Department of cleaning service",
    },
  ]);
}
