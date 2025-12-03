// FILE: src/database/seeds/01_seed_master_offices_hierarchy.ts
import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Hapus data lama
  // 1. Matikan pengecekan Foreign Key sementara
  await knex.raw("SET FOREIGN_KEY_CHECKS = 0");

  // 2. Hapus data lama (Sekarang sudah boleh karena check dimatikan)
  await knex("master_offices").truncate();
  await knex("master_offices").insert([
    {
      // ROOT: OFC0000001
      name: "Kantor Pusat Jakarta",
      office_code: "OFC0000001",
      parent_office_code: null,
      description: "Pusat Operasional",
      address: "Jl. Sudirman No. 1",
      latitude: -6.2088,
      longitude: 106.8456,
      radius_meters: 100,
    },
    {
      // ANAK 1: OFC0000002 (Anaknya OFC0000001)
      name: "Kantor Cabang Jawa Timur",
      office_code: "OFC0000002",
      parent_office_code: "OFC0000001",
      description: "Cabang Jatim",
      address: "Surabaya",
      latitude: -7.2575,
      longitude: 112.7521,
      radius_meters: 50,
    },
    {
      // CUCU 1: OFC0000003 (Anaknya OFC0000002)
      name: "Kantor Unit Madiun",
      office_code: "OFC0000003",
      parent_office_code: "OFC0000002",
      description: "Unit Madiun",
      address: "Madiun",
      latitude: -7.6298,
      longitude: 111.5177,
      radius_meters: 30,
    },
    {
      // ANAK 2: OFC0000004 (Anaknya OFC0000001)
      name: "Kantor Cabang Jawa Tengah",
      office_code: "OFC0000004",
      parent_office_code: "OFC0000001",
      description: "Cabang Jateng",
      address: "Semarang",
      latitude: -6.9932,
      longitude: 110.4203,
      radius_meters: 50,
    },
  ]);
  await knex.raw("SET FOREIGN_KEY_CHECKS = 1");
}
