import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("master_departments").del();

  await knex("master_departments")
    .insert([
      // ==========================================
      // 1. KANTOR PUSAT (OFC0000001)
      // ==========================================
      {
        department_code: "DPT0100001",
        name: "Technology & Infrastructure",
        office_code: "OFC0000001",
        description: "IT Dept",
      },
      {
        department_code: "DPT0100002",
        name: "Human Capital Management",
        office_code: "OFC0000001",
        description: "HR Dept",
      },

      // ==========================================
      // 2. CABANG SURABAYA (OFC0000002)
      // ==========================================
      {
        department_code: "DPT0200001",
        name: "Regional Sales",
        office_code: "OFC0000002",
        description: "Sales Jatim",
      },
      {
        department_code: "DPT0200002",
        name: "Area Marketing",
        office_code: "OFC0000002",
        description: "Marketing Jatim",
      },
    ])
    .onConflict("department_code")
    .merge();
}
