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

      // Dept 3: Corporate Finance (DPT0100003)
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

      // Dept 4: Legal & Compliance (DPT0100004)
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

      // Dept 5: Supply Chain Management (DPT0100005)
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

      // Dept 3: Customer Experience (DPT0200003)
      {
        division_code: "DIV0203001",
        department_code: "DPT0200003",
        name: "Customer Service Jatim",
        description: "Layanan pelanggan cabang",
      },
      {
        division_code: "DIV0203002",
        department_code: "DPT0200003",
        name: "Technical Support Jatim",
        description: "Bantuan teknis cabang",
      },

      // Dept 4: Branch Operations (DPT0200004)
      {
        division_code: "DIV0204001",
        department_code: "DPT0200004",
        name: "General Admin Jatim",
        description: "Administrasi umum cabang",
      },
      {
        division_code: "DIV0204002",
        department_code: "DPT0200004",
        name: "Facility Management",
        description: "Pemeliharaan kantor cabang",
      },

      // Dept 5: Inventory & Warehouse (DPT0200005)
      {
        division_code: "DIV0205001",
        department_code: "DPT0200005",
        name: "Warehouse Ops Jatim",
        description: "Gudang Surabaya",
      },
      {
        division_code: "DIV0205002",
        department_code: "DPT0200005",
        name: "Stock Control Jatim",
        description: "Kontrol stok Surabaya",
      },

      // =================================================================
      // 3. UNIT MADIUN (OFC03)
      // =================================================================

      // Dept 1: Unit Sales (DPT0300001)
      {
        division_code: "DIV0301001",
        department_code: "DPT0300001",
        name: "Sales Team A - Madiun",
        description: "Tim Penjualan A",
      },
      {
        division_code: "DIV0301002",
        department_code: "DPT0300001",
        name: "Sales Team B - Madiun",
        description: "Tim Penjualan B",
      },

      // Dept 2: Unit Admin (DPT0300002)
      {
        division_code: "DIV0302001",
        department_code: "DPT0300002",
        name: "Administration Madiun",
        description: "Admin operasional",
      },
      {
        division_code: "DIV0302002",
        department_code: "DPT0300002",
        name: "Reporting Madiun",
        description: "Pelaporan unit",
      },

      // Dept 3: Unit Warehouse (DPT0300003)
      {
        division_code: "DIV0303001",
        department_code: "DPT0300003",
        name: "Inbound Madiun",
        description: "Barang masuk unit",
      },
      {
        division_code: "DIV0303002",
        department_code: "DPT0300003",
        name: "Outbound Madiun",
        description: "Barang keluar unit",
      },

      // Dept 4: Unit Support (DPT0300004)
      {
        division_code: "DIV0304001",
        department_code: "DPT0300004",
        name: "Tech Support Madiun",
        description: "Teknisi unit",
      },
      {
        division_code: "DIV0304002",
        department_code: "DPT0300004",
        name: "Maintenance Madiun",
        description: "Pemeliharaan aset unit",
      },

      // Dept 5: Unit General (DPT0300005)
      {
        division_code: "DIV0305001",
        department_code: "DPT0300005",
        name: "GA Madiun",
        description: "Umum dan kebersihan",
      },
      {
        division_code: "DIV0305002",
        department_code: "DPT0300005",
        name: "Security Madiun",
        description: "Keamanan unit",
      },

      // =================================================================
      // 4. UNIT MALANG (OFC04)
      // =================================================================

      // Dept 1: Unit Sales (DPT0400001)
      {
        division_code: "DIV0401001",
        department_code: "DPT0400001",
        name: "Sales Team A - Malang",
        description: "Tim Penjualan A",
      },
      {
        division_code: "DIV0401002",
        department_code: "DPT0400001",
        name: "Sales Team B - Malang",
        description: "Tim Penjualan B",
      },

      // Dept 2: Unit Admin (DPT0400002)
      {
        division_code: "DIV0402001",
        department_code: "DPT0400002",
        name: "Administration Malang",
        description: "Admin operasional",
      },
      {
        division_code: "DIV0402002",
        department_code: "DPT0400002",
        name: "Reporting Malang",
        description: "Pelaporan unit",
      },

      // Dept 3: Unit Warehouse (DPT0400003)
      {
        division_code: "DIV0403001",
        department_code: "DPT0400003",
        name: "Inbound Malang",
        description: "Barang masuk unit",
      },
      {
        division_code: "DIV0403002",
        department_code: "DPT0400003",
        name: "Outbound Malang",
        description: "Barang keluar unit",
      },

      // Dept 4: Unit Support (DPT0400004)
      {
        division_code: "DIV0404001",
        department_code: "DPT0400004",
        name: "Tech Support Malang",
        description: "Teknisi unit",
      },
      {
        division_code: "DIV0404002",
        department_code: "DPT0400004",
        name: "Maintenance Malang",
        description: "Pemeliharaan aset unit",
      },

      // Dept 5: Unit General (DPT0400005)
      {
        division_code: "DIV0405001",
        department_code: "DPT0400005",
        name: "GA Malang",
        description: "Umum dan kebersihan",
      },
      {
        division_code: "DIV0405002",
        department_code: "DPT0400005",
        name: "Security Malang",
        description: "Keamanan unit",
      },

      // =================================================================
      // 5. UNIT KEDIRI (OFC05)
      // =================================================================

      // Dept 1: Unit Sales (DPT0500001)
      {
        division_code: "DIV0501001",
        department_code: "DPT0500001",
        name: "Sales Team A - Kediri",
        description: "Tim Penjualan A",
      },
      {
        division_code: "DIV0501002",
        department_code: "DPT0500001",
        name: "Sales Team B - Kediri",
        description: "Tim Penjualan B",
      },

      // Dept 2: Unit Admin (DPT0500002)
      {
        division_code: "DIV0502001",
        department_code: "DPT0500002",
        name: "Administration Kediri",
        description: "Admin operasional",
      },
      {
        division_code: "DIV0502002",
        department_code: "DPT0500002",
        name: "Reporting Kediri",
        description: "Pelaporan unit",
      },

      // Dept 3: Unit Warehouse (DPT0500003)
      {
        division_code: "DIV0503001",
        department_code: "DPT0500003",
        name: "Inbound Kediri",
        description: "Barang masuk unit",
      },
      {
        division_code: "DIV0503002",
        department_code: "DPT0500003",
        name: "Outbound Kediri",
        description: "Barang keluar unit",
      },

      // Dept 4: Unit Support (DPT0500004)
      {
        division_code: "DIV0504001",
        department_code: "DPT0500004",
        name: "Tech Support Kediri",
        description: "Teknisi unit",
      },
      {
        division_code: "DIV0504002",
        department_code: "DPT0500004",
        name: "Maintenance Kediri",
        description: "Pemeliharaan aset unit",
      },

      // Dept 5: Unit General (DPT0500005)
      {
        division_code: "DIV0505001",
        department_code: "DPT0500005",
        name: "GA Kediri",
        description: "Umum dan kebersihan",
      },
      {
        division_code: "DIV0505002",
        department_code: "DPT0500005",
        name: "Security Kediri",
        description: "Keamanan unit",
      },
    ])
    .onConflict("division_code")
    .merge();
}
