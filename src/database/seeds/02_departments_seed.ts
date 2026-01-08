import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Hapus data lama (Opsional, gunakan jika ingin reset total)
  // await knex("master_departments").del();

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
      {
        department_code: "DPT0100003",
        name: "Corporate Finance",
        office_code: "OFC0000001",
        description: "Finance Dept",
      },
      {
        department_code: "DPT0100004",
        name: "Legal & Compliance",
        office_code: "OFC0000001",
        description: "Legal Dept",
      },
      {
        department_code: "DPT0100005",
        name: "Supply Chain Management",
        office_code: "OFC0000001",
        description: "SCM Dept",
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
      {
        department_code: "DPT0200003",
        name: "Customer Experience",
        office_code: "OFC0000002",
        description: "CS Regional",
      },
      {
        department_code: "DPT0200004",
        name: "Branch Operations",
        office_code: "OFC0000002",
        description: "Ops Cabang",
      },
      {
        department_code: "DPT0200005",
        name: "Inventory & Warehouse",
        office_code: "OFC0000002",
        description: "Gudang Cabang",
      },

      // ==========================================
      // 3. UNIT MADIUN (OFC0000003)
      // ==========================================
      {
        department_code: "DPT0300001",
        name: "Unit Sales",
        office_code: "OFC0000003",
        description: "Penjualan Unit",
      },
      {
        department_code: "DPT0300002",
        name: "Unit Admin",
        office_code: "OFC0000003",
        description: "Admin Unit",
      },
      {
        department_code: "DPT0300003",
        name: "Unit Warehouse",
        office_code: "OFC0000003",
        description: "Gudang Unit",
      },
      {
        department_code: "DPT0300004",
        name: "Unit Support",
        office_code: "OFC0000003",
        description: "Teknisi Unit",
      },
      {
        department_code: "DPT0300005",
        name: "Unit General",
        office_code: "OFC0000003",
        description: "Umum Unit",
      },

      // ==========================================
      // 4. UNIT MALANG (OFC0000004)
      // ==========================================
      {
        department_code: "DPT0400001",
        name: "Unit Sales",
        office_code: "OFC0000004",
        description: "Penjualan Unit",
      },
      {
        department_code: "DPT0400002",
        name: "Unit Admin",
        office_code: "OFC0000004",
        description: "Admin Unit",
      },
      {
        department_code: "DPT0400003",
        name: "Unit Warehouse",
        office_code: "OFC0000004",
        description: "Gudang Unit",
      },
      {
        department_code: "DPT0400004",
        name: "Unit Support",
        office_code: "OFC0000004",
        description: "Teknisi Unit",
      },
      {
        department_code: "DPT0400005",
        name: "Unit General",
        office_code: "OFC0000004",
        description: "Umum Unit",
      },

      // ==========================================
      // 5. UNIT KEDIRI (OFC0000005)
      // ==========================================
      {
        department_code: "DPT0500001",
        name: "Unit Sales",
        office_code: "OFC0000005",
        description: "Penjualan Unit",
      },
      {
        department_code: "DPT0500002",
        name: "Unit Admin",
        office_code: "OFC0000005",
        description: "Admin Unit",
      },
      {
        department_code: "DPT0500003",
        name: "Unit Warehouse",
        office_code: "OFC0000005",
        description: "Gudang Unit",
      },
      {
        department_code: "DPT0500004",
        name: "Unit Support",
        office_code: "OFC0000005",
        description: "Teknisi Unit",
      },
      {
        department_code: "DPT0500005",
        name: "Unit General",
        office_code: "OFC0000005",
        description: "Umum Unit",
      },
    ])
    .onConflict("department_code")
    .merge();
}
