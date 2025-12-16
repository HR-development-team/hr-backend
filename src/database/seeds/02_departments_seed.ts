import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Hapus data lama (Opsional, gunakan jika ingin reset total)
  // await knex("master_departments").del();

  await knex("master_departments")
    .insert([
      // ==========================================
      // KANTOR PUSAT (OFC0000001) -> Prefix: 01
      // ==========================================
      {
        department_code: "DPT0100001",
        name: "Technology",
        office_code: "OFC0000001",
        description: "IT & Development Team",
      },
      {
        department_code: "DPT0100002",
        name: "Human Resources",
        office_code: "OFC0000001",
        description: "Recruitment & Employee Relations",
      },
      {
        department_code: "DPT0100003",
        name: "Finance & Accounting",
        office_code: "OFC0000001",
        description: "Financial Management Pusat",
      },
      {
        department_code: "DPT0100004",
        name: "Executive Management",
        office_code: "OFC0000001",
        description: "Board of Directors & Strategists",
      },

      // ==========================================
      // CABANG JAWA TIMUR (OFC0000002) -> Prefix: 02
      // ==========================================
      {
        department_code: "DPT0200001", // <--- Reset sequence ke 1
        name: "Sales Region Jatim",
        office_code: "OFC0000002",
        description: "Penjualan Wilayah Jawa Timur",
      },
      {
        department_code: "DPT0200002",
        name: "Marketing & Promotion",
        office_code: "OFC0000002",
        description: "Pemasaran Lokal Surabaya",
      },
      {
        department_code: "DPT0200003",
        name: "Customer Success",
        office_code: "OFC0000002",
        description: "Layanan Pelanggan Jatim",
      },

      // ==========================================
      // UNIT MADIUN (OFC0000003) -> Prefix: 03
      // ==========================================
      {
        department_code: "DPT0300001", // <--- Reset sequence ke 1
        name: "Field Operations",
        office_code: "OFC0000003",
        description: "Tim Lapangan Area Madiun",
      },
      {
        department_code: "DPT0300002",
        name: "Unit Administration",
        office_code: "OFC0000003",
        description: "Administrasi Pemberkasan Unit",
      },
      {
        department_code: "DPT0300003",
        name: "Logistics & Warehouse",
        office_code: "OFC0000003",
        description: "Gudang & Logistik Madiun",
      },

      // ==========================================
      // CABANG JAWA TENGAH (OFC0000004) -> Prefix: 04
      // ==========================================
      {
        department_code: "DPT0400001", // <--- Reset sequence ke 1
        name: "Sales Region Jateng",
        office_code: "OFC0000004",
        description: "Penjualan Wilayah Jawa Tengah",
      },
      {
        department_code: "DPT0400002",
        name: "General Affair",
        office_code: "OFC0000004",
        description: "Umum & Pemeliharaan Aset Jateng",
      },
      {
        department_code: "DPT0400003",
        name: "Business Development",
        office_code: "OFC0000004",
        description: "Pengembangan Bisnis Semarang",
      },
    ])
    .onConflict("department_code") // Mencegah error duplikat jika di-run ulang
    .merge(); // Update data jika sudah ada
}
