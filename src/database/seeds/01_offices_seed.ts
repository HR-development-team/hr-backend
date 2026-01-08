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
    // 3. UNIT 1 (Child of Cabang Surabaya)
    {
      office_code: "OFC0000003",
      name: "Kantor Unit Madiun",
      address: "Jl. Pahlawan, Madiun",
      latitude: -7.6298,
      longitude: 111.5177,
      radius_meters: 30,
      parent_office_code: "OFC0000002",
      sort_order: 3,
      description: "Unit Operasional Madiun",
    },
    // 4. UNIT 2 (Child of Cabang Surabaya)
    {
      office_code: "OFC0000004",
      name: "Kantor Unit Malang",
      address: "Jl. Ijen, Malang",
      latitude: -7.9666,
      longitude: 112.6326,
      radius_meters: 30,
      parent_office_code: "OFC0000002",
      sort_order: 4,
      description: "Unit Operasional Malang",
    },
    // 5. UNIT 3 (Child of Cabang Surabaya)
    {
      office_code: "OFC0000005",
      name: "Kantor Unit Kediri",
      address: "Jl. Dhoho, Kediri",
      latitude: -7.8485,
      longitude: 112.0178,
      radius_meters: 30,
      parent_office_code: "OFC0000002",
      sort_order: 5,
      description: "Unit Operasional Kediri",
    },
  ]);
}
