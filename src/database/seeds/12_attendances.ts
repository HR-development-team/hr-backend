// File: seeds/11_attendances.ts
// VERSI WORKAROUND (HANYA 1 DATA PER KARYAWAN)
import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  const budi = await knex("master_employees")
    .where({ employee_code: "E-001" })
    .first();
  const citra = await knex("master_employees")
    .where({ employee_code: "E-002" })
    .first();
  const sesiTgl10 = await knex("attendance_sessions")
    .where({ date: "2025-11-10" })
    .first();

  if (!budi || !citra || !sesiTgl10) {
    // eslint-disable-next-line no-console
    console.error(
      "Karyawan atau Sesi Absensi tidak ditemukan untuk seeder absensi."
    );
    return;
  }

  await knex("attendances").insert([
    // Absensi Budi (Hanya 1)
    {
      employee_id: budi.id,
      session_id: sesiTgl10.id,
      check_in_time: "2025-11-10 08:30:00",
      check_out_time: "2025-11-10 17:05:00",
      check_in_status: "in-time",
      check_out_status: "in-time",
    },

    // Absensi Citra (Hanya 1)
    {
      employee_id: citra.id,
      session_id: sesiTgl10.id,
      check_in_time: "2025-11-10 08:50:00",
      check_out_time: "2025-11-10 17:30:00",
      check_in_status: "in-time",
      check_out_status: "overtime",
    },
  ]);
}
