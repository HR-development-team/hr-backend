import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1. Bersihkan data lama
  await knex("master_shifts").del();

  // 2. Insert Data Dummy
  await knex("master_shifts").insert([
    // --- 1. SHIFT REGULAR PUSAT (SFT0000001) ---
    // Office: OFC0000001 (Pusat) | Senin-Jumat | 08:00 - 17:00
    {
      shift_code: "SFT0000001",
      name: "Regular Head Office",
      office_code: "OFC0000001",
      start_time: "08:00:00",
      end_time: "17:00:00",
      work_days: JSON.stringify([1, 2, 3, 4, 5]),
      late_tolerance_minutes: 15,
      check_in_limit_minutes: 60,
      check_out_limit_minutes: 120,
      is_overnight: 0,
    },

    // --- 2. SHIFT SURABAYA (SFT0000002) ---
    // Office: OFC0000002 (Jatim) | Senin-Jumat | 09:00 - 18:00 (Agak siang)
    {
      shift_code: "SFT0000002",
      name: "Shift Operasional Surabaya",
      office_code: "OFC0000002",
      start_time: "09:00:00",
      end_time: "18:00:00",
      work_days: JSON.stringify([1, 2, 3, 4, 5]),
      late_tolerance_minutes: 10,
      check_in_limit_minutes: 60,
      check_out_limit_minutes: 120,
      is_overnight: 0,
    },

    // --- 3. SHIFT MADIUN (SFT0000003) ---
    // Office: OFC0000003 (Madiun) | Senin-Sabtu (6 Hari) | 08:00 - 14:00
    {
      shift_code: "SFT0000003",
      name: "Shift Unit Madiun",
      office_code: "OFC0000003",
      start_time: "08:00:00",
      end_time: "14:00:00",
      work_days: JSON.stringify([1, 2, 3, 4, 5, 6]),
      late_tolerance_minutes: 15,
      check_in_limit_minutes: 30,
      check_out_limit_minutes: 60,
      is_overnight: 0,
    },

    // --- 4. SHIFT SECURITY MALAM PUSAT (SFT0000004) ---
    // Office: OFC0000001 (Pusat) | Tiap Hari | 22:00 - 06:00 (Lintas Hari)
    {
      shift_code: "SFT0000004",
      name: "Shift Security Malam",
      office_code: "OFC0000001",
      start_time: "22:00:00",
      end_time: "06:00:00",
      work_days: JSON.stringify([0, 1, 2, 3, 4, 5, 6]),
      late_tolerance_minutes: 0,
      check_in_limit_minutes: 30,
      check_out_limit_minutes: 30,
      is_overnight: 1, // True
    },
  ]);
}
