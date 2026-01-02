import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Membersihkan data lama
  await knex("master_divisions").del();

  await knex("master_divisions")
    .insert([
      // =======================================================
      // KANTOR PUSAT (01) - 5 DEPARTEMEN x 2 DIVISI
      // =======================================================

      // 1. Technology & Infrastructure (DPT0100001)
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

      // 2. Human Capital Management (DPT0100002)
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

      // 3. Corporate Finance (DPT0100003)
      {
        division_code: "DIV0103001",
        department_code: "DPT0100003",
        name: "Accounting & Tax",
        description: "Pembukuan dan laporan pajak",
      },
      {
        division_code: "DIV0103002",
        department_code: "DPT0100003",
        name: "Treasury",
        description: "Manajemen arus kas pusat",
      },

      // 4. Legal & Compliance (DPT0100004)
      {
        division_code: "DIV0104001",
        department_code: "DPT0100004",
        name: "Corporate Legal",
        description: "Urusan kontrak dan legalitas",
      },
      {
        division_code: "DIV0104002",
        department_code: "DPT0100004",
        name: "Internal Audit",
        description: "Audit kepatuhan operasional",
      },

      // 5. Supply Chain Management (DPT0100005)
      {
        division_code: "DIV0105001",
        department_code: "DPT0100005",
        name: "Procurement",
        description: "Pengadaan barang pusat",
      },
      {
        division_code: "DIV0105002",
        department_code: "DPT0100005",
        name: "Logistics Planning",
        description: "Perencanaan distribusi nasional",
      },

      // =======================================================
      // KANTOR CABANG SURABAYA (02) - 5 DEPARTEMEN x 2 DIVISI
      // =======================================================

      // 1. Regional Sales (DPT0200001)
      {
        division_code: "DIV0201001",
        department_code: "DPT0200001",
        name: "B2B Sales",
        description: "Penjualan segmen korporasi Jatim",
      },
      {
        division_code: "DIV0201002",
        department_code: "DPT0200001",
        name: "Direct Sales",
        description: "Penjualan langsung ke user",
      },

      // 2. Area Marketing (DPT0200002)
      {
        division_code: "DIV0202001",
        department_code: "DPT0200002",
        name: "Digital Marketing",
        description: "Promosi medsos area Jatim",
      },
      {
        division_code: "DIV0202002",
        department_code: "DPT0200002",
        name: "Event & Activation",
        description: "Kegiatan promosi lapangan",
      },

      // 3. Customer Experience (DPT0200003)
      {
        division_code: "DIV0203001",
        department_code: "DPT0200003",
        name: "Customer Service",
        description: "Layanan informasi pelanggan",
      },
      {
        division_code: "DIV0203002",
        department_code: "DPT0200003",
        name: "Technical Support",
        description: "Bantuan teknis pelanggan",
      },

      // 4. Branch Operations (DPT0200004)
      {
        division_code: "DIV0204001",
        department_code: "DPT0200004",
        name: "General Admin",
        description: "Administrasi kantor cabang",
      },
      {
        division_code: "DIV0204002",
        department_code: "DPT0200004",
        name: "Facility Management",
        description: "Pemeliharaan gedung cabang",
      },

      // 5. Inventory & Warehouse (DPT0200005)
      {
        division_code: "DIV0205001",
        department_code: "DPT0200005",
        name: "Warehouse Ops",
        description: "Operasional gudang regional",
      },
      {
        division_code: "DIV0205002",
        department_code: "DPT0200005",
        name: "Stock Control",
        description: "Manajemen stok barang",
      },
    ])
    .onConflict("division_code")
    .merge();
}
