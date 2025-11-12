import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Hanya insert, .del() sudah diurus oleh 00_delete_all.ts
  await knex("master_departments").insert([
    {
      department_code: "TEK",
      name: "Teknologi",
      description: "Divisi yang menangani pengembangan dan infrastruktur.",
    },
    {
      department_code: "HR",
      name: "Human Resources",
      description: "Divisi yang menangani sumber daya manusia.",
    },
    {
      department_code: "KEU",
      name: "Keuangan",
      description: "Divisi yang menangani keuangan dan akuntansi.",
    },
  ]);
}
