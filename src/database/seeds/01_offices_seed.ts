import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("master_offices").insert([
    // 1. KANTOR PUSAT (Root)
    {
      office_code: "OFC0000001",
      name: "Kantor Pusat Jakarta",
      address: "Jl. Sudirman No. 1, Jakarta",
      latitude: -6.2088,
      longitude: 106.8456,
      radius_meters: 100,
      parent_office_code: null,
      sort_order: 1,
      description: "Head Office",
    },
    // 2. KANTOR CABANG KOTA (Child of Pusat)
    {
      office_code: "OFC0000002",
      name: "Kantor Cabang Surabaya",
      address: "Jl. Tunjungan, Surabaya",
      latitude: -7.2575,
      longitude: 112.7521,
      radius_meters: 50,
      parent_office_code: "OFC0000001",
      sort_order: 2,
      description: "Branch Office Kota Besar",
    },
  ]);
}
