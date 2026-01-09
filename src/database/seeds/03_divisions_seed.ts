import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Hapus data lama
  await knex("master_divisions").del();

  await knex("master_divisions")
    .insert([
      // =================================================================
      // 1. KANTOR PUSAT (OFC01)
      // =================================================================

      // Dept 1: Technology & Infrastructure (DPT0100001)
      {
        division_code: "DIV0101001",
        department_code: "DPT0100001",
        name: "Software Engineering",
        description: "Pengembangan aplikasi internal",
      },
      {
        division_code: "DIV0101002",
        department_code: "DPT0100001",
        name: "IT Infrastructure",
        description: "Manajemen server dan jaringan",
      },

      // Dept 2: Human Capital Management (DPT0100002)
      {
        division_code: "DIV0102001",
        department_code: "DPT0100002",
        name: "Recruitment & Branding",
        description: "Pencarian talenta baru",
      },
      {
        division_code: "DIV0102002",
        department_code: "DPT0100002",
        name: "People Development",
        description: "Pelatihan dan KPI karyawan",
      },

      // =================================================================
      // 2. KANTOR CABANG SURABAYA (OFC02)
      // =================================================================

      // Dept 1: Regional Sales (DPT0200001)
      {
        division_code: "DIV0201001",
        department_code: "DPT0200001",
        name: "B2B Sales Jatim",
        description: "Penjualan korporat area Jatim",
      },
      {
        division_code: "DIV0201002",
        department_code: "DPT0200001",
        name: "Direct Sales Jatim",
        description: "Penjualan ritel area Jatim",
      },

      // Dept 2: Area Marketing (DPT0200002)
      {
        division_code: "DIV0202001",
        department_code: "DPT0200002",
        name: "Digital Marketing Jatim",
        description: "Promosi digital area",
      },
      {
        division_code: "DIV0202002",
        department_code: "DPT0200002",
        name: "Event & Activation",
        description: "Event offline cabang",
      },
    ])
    .onConflict("division_code")
    .merge();
}
