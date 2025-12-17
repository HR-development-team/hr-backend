import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Hapus data lama (Opsional)
  // await knex("master_divisions").del();

  await knex("master_divisions")
    .insert([
      // =======================================================
      // KANTOR PUSAT (01)
      // =======================================================

      // 1. DPT0100001 - Technology
      {
        division_code: "DIV0101001",
        department_code: "DPT0100001",
        name: "Software Engineering",
        description: "Pengembangan Aplikasi & Sistem",
      },
      {
        division_code: "DIV0101002",
        department_code: "DPT0100001",
        name: "IT Infrastructure",
        description: "Jaringan & Server",
      },
      {
        division_code: "DIV0101003",
        department_code: "DPT0100001",
        name: "Data & Security",
        description: "Keamanan Siber & Analisis Data",
      },

      // 2. DPT0100002 - Human Resources
      {
        division_code: "DIV0102001",
        department_code: "DPT0100002",
        name: "Recruitment",
        description: "Perekrutan Karyawan Baru",
      },
      {
        division_code: "DIV0102002",
        department_code: "DPT0100002",
        name: "Employee Relations",
        description: "Hubungan Industrial",
      },
      {
        division_code: "DIV0102003",
        department_code: "DPT0100002",
        name: "Training & Development",
        description: "Pelatihan & Pengembangan Skill",
      },

      // 3. DPT0100003 - Finance & Accounting
      {
        division_code: "DIV0103001",
        department_code: "DPT0100003",
        name: "Accounting",
        description: "Pembukuan & Laporan Keuangan",
      },
      {
        division_code: "DIV0103002",
        department_code: "DPT0100003",
        name: "Tax & Treasury",
        description: "Perpajakan & Kas",
      },
      {
        division_code: "DIV0103003",
        department_code: "DPT0100003",
        name: "Budgeting",
        description: "Perencanaan Anggaran",
      },

      // 4. DPT0100004 - Executive Management
      {
        division_code: "DIV0104001",
        department_code: "DPT0100004",
        name: "Board Support",
        description: "Sekretariat Direksi",
      },
      {
        division_code: "DIV0104002",
        department_code: "DPT0100004",
        name: "Strategic Planning",
        description: "Perencanaan Strategis Korporat",
      },
      {
        division_code: "DIV0104003",
        department_code: "DPT0100004",
        name: "Internal Audit",
        description: "Audit Internal & Kepatuhan",
      },

      // =======================================================
      // CABANG JAWA TIMUR (02)
      // =======================================================

      // 5. DPT0200001 - Sales Region Jatim
      {
        division_code: "DIV0201001",
        department_code: "DPT0200001",
        name: "Direct Sales",
        description: "Penjualan Langsung",
      },
      {
        division_code: "DIV0201002",
        department_code: "DPT0200001",
        name: "Corporate Sales",
        description: "Penjualan B2B",
      },
      {
        division_code: "DIV0201003",
        department_code: "DPT0200001",
        name: "Sales Admin",
        description: "Administrasi Penjualan",
      },

      // 6. DPT0200002 - Marketing & Promotion
      {
        division_code: "DIV0202001",
        department_code: "DPT0200002",
        name: "Digital Marketing",
        description: "Pemasaran Online & Medsos",
      },
      {
        division_code: "DIV0202002",
        department_code: "DPT0200002",
        name: "Event Management",
        description: "Aktivasi Brand & Event",
      },
      {
        division_code: "DIV0202003",
        department_code: "DPT0200002",
        name: "Creative Design",
        description: "Desain Grafis & Konten",
      },

      // 7. DPT0200003 - Customer Success
      {
        division_code: "DIV0203001",
        department_code: "DPT0200003",
        name: "Helpdesk L1",
        description: "Layanan Pelanggan Dasar",
      },
      {
        division_code: "DIV0203002",
        department_code: "DPT0200003",
        name: "Technical Support L2",
        description: "Dukungan Teknis Lanjutan",
      },
      {
        division_code: "DIV0203003",
        department_code: "DPT0200003",
        name: "Retention",
        description: "Penanganan Komplain & Retensi",
      },

      // =======================================================
      // UNIT MADIUN (03)
      // =======================================================

      // 8. DPT0300001 - Field Operations
      {
        division_code: "DIV0301001",
        department_code: "DPT0300001",
        name: "Installation Team",
        description: "Tim Pasang Baru",
      },
      {
        division_code: "DIV0301002",
        department_code: "DPT0300001",
        name: "Maintenance Team",
        description: "Tim Perbaikan & Pemeliharaan",
      },
      {
        division_code: "DIV0301003",
        department_code: "DPT0300001",
        name: "Quality Control",
        description: "QC Lapangan",
      },

      // 9. DPT0300002 - Unit Administration
      {
        division_code: "DIV0302001",
        department_code: "DPT0300002",
        name: "Front Office",
        description: "Resepsionis & Tamu",
      },
      {
        division_code: "DIV0302002",
        department_code: "DPT0300002",
        name: "Filing & Archive",
        description: "Pengarsipan Dokumen",
      },
      {
        division_code: "DIV0302003",
        department_code: "DPT0300002",
        name: "General Admin",
        description: "Surat Menyurat",
      },

      // 10. DPT0300003 - Logistics & Warehouse
      {
        division_code: "DIV0303001",
        department_code: "DPT0300003",
        name: "Inbound Logistics",
        description: "Penerimaan Barang",
      },
      {
        division_code: "DIV0303002",
        department_code: "DPT0300003",
        name: "Inventory Control",
        description: "Stok Opname & Kontrol",
      },
      {
        division_code: "DIV0303003",
        department_code: "DPT0300003",
        name: "Distribution",
        description: "Pengiriman Unit",
      },

      // =======================================================
      // CABANG JAWA TENGAH (04)
      // =======================================================

      // 11. DPT0400001 - Sales Region Jateng
      {
        division_code: "DIV0401001",
        department_code: "DPT0400001",
        name: "Area Semarang",
        description: "Sales Tim Semarang",
      },
      {
        division_code: "DIV0401002",
        department_code: "DPT0400001",
        name: "Area Solo",
        description: "Sales Tim Solo",
      },
      {
        division_code: "DIV0401003",
        department_code: "DPT0400001",
        name: "Sales Support",
        description: "Pendukung Penjualan Jateng",
      },

      // 12. DPT0400002 - General Affair
      {
        division_code: "DIV0402001",
        department_code: "DPT0400002",
        name: "Building Management",
        description: "Kebersihan & Gedung",
      },
      {
        division_code: "DIV0402002",
        department_code: "DPT0400002",
        name: "Transportation",
        description: "Kendaraan Operasional",
      },
      {
        division_code: "DIV0402003",
        department_code: "DPT0400002",
        name: "Security & Safety",
        description: "Keamanan & K3",
      },

      // 13. DPT0400003 - Business Development
      {
        division_code: "DIV0403001",
        department_code: "DPT0400003",
        name: "Partnership",
        description: "Kemitraan Lokal",
      },
      {
        division_code: "DIV0403002",
        department_code: "DPT0400003",
        name: "Market Research",
        description: "Riset Pasar Jateng",
      },
      {
        division_code: "DIV0403003",
        department_code: "DPT0400003",
        name: "Product Expansion",
        description: "Ekspansi Produk Baru",
      },
    ])
    .onConflict("division_code")
    .merge();
}
