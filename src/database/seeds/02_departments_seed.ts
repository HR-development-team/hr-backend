import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Hapus data lama (Opsional, gunakan jika ingin reset total)
  // await knex("master_departments").del();

  await knex("master_departments").del();

  await knex("master_departments")
    .insert([
      // ==========================================
      // DEPARTEMEN UNTUK KANTOR PUSAT (OFC0000001)
      // ==========================================
      {
        department_code: "DPT0100001",
        name: "Technology & Infrastructure",
        office_code: "OFC0000001",
        description: "Pengembangan software dan infrastruktur IT",
      },
      {
        department_code: "DPT0100002",
        name: "Human Capital Management",
        office_code: "OFC0000001",
        description: "Manajemen SDM dan pelatihan",
      },
      {
        department_code: "DPT0100003",
        name: "Corporate Finance",
        office_code: "OFC0000001",
        description: "Pengelolaan keuangan dan audit internal",
      },
      {
        department_code: "DPT0100004",
        name: "Legal & Compliance",
        office_code: "OFC0000001",
        description: "Urusan hukum dan kepatuhan regulasi",
      },
      {
        department_code: "DPT0100005",
        name: "Supply Chain Management",
        office_code: "OFC0000001",
        description: "Pengadaan barang dan logistik pusat",
      },

      // ==========================================
      // DEPARTEMEN UNTUK KANTOR CABANG (OFC0000002)
      // ==========================================
      {
        department_code: "DPT0200001",
        name: "Regional Sales",
        office_code: "OFC0000002",
        description: "Target penjualan wilayah Jawa Timur",
      },
      {
        department_code: "DPT0200002",
        name: "Area Marketing",
        office_code: "OFC0000002",
        description: "Promosi dan aktivasi lokal",
      },
      {
        department_code: "DPT0200003",
        name: "Customer Experience",
        office_code: "OFC0000002",
        description: "Layanan bantuan pelanggan regional",
      },
      {
        department_code: "DPT0200004",
        name: "Branch Operations",
        office_code: "OFC0000002",
        description: "Operasional harian kantor cabang",
      },
      {
        department_code: "DPT0200005",
        name: "Inventory & Warehouse",
        office_code: "OFC0000002",
        description: "Stok gudang dan distribusi regional",
      },
    ])
    .onConflict("department_code") // Mencegah error duplikat jika di-run ulang
    .merge(); // Update data jika sudah ada
}
