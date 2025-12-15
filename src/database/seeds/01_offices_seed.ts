import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("master_offices").insert([
    {
      office_code: "OFC0000001",
      name: "Kantor Pusat ",
      address: "Jl. Sudirman No. 1",
      latitude: -6.2088,
      longitude: 106.8456,
      radius_meters: 100,
      parent_office_code: null,
      sort_order: 1,
      description: "Pusat Operasional",
    },
    {
      office_code: "OFC0000002",
      name: "Kantor Cabang Jawa Timur",
      address: "Surabaya",
      latitude: -7.2575,
      longitude: 112.7521,
      radius_meters: 50,
      parent_office_code: "OFC0000001",
      sort_order: 2,
      description: "Cabang Jatim",
    },
    {
      office_code: "OFC0000003",
      name: "Kantor Unit Madiun",
      address: "Madiun",
      latitude: -7.6298,
      longitude: 111.5177,
      radius_meters: 30,
      parent_office_code: "OFC0000002",
      sort_order: 3,
      description: "Unit Madiun",
    },
    {
      office_code: "OFC0000004",
      name: "Kantor Cabang Jawa Tengah",
      address: "Semarang",
      latitude: -6.9932,
      longitude: 110.4203,
      radius_meters: 50,
      parent_office_code: "OFC0000001",
      sort_order: 4,
      description: "Cabang Jateng",
    },
  ]);
}
