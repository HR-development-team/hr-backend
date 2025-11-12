import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Ambil ID admin (E-003) untuk kolom 'created_by'
  const admin = await knex("master_employees")
    .where({ employee_code: "E-003" })
    .first();

  if (!admin) {
    console.error("Admin (E-003) tidak ditemukan untuk membuat sesi absensi.");
    return;
  }

  await knex("attendance_sessions").insert([
    {
      date: "2025-11-10",
      status: "closed",
      open_time: "07:00:00",
      cutoff_time: "09:00:00",
      close_time: "17:00:00",
      created_by: admin.id,
    },
    {
      date: "2025-11-11",
      status: "closed",
      open_time: "07:00:00",
      cutoff_time: "09:00:00",
      close_time: "17:00:00",
      created_by: admin.id,
    },
    {
      date: "2025-11-12",
      status: "open", // Sesi hari ini
      open_time: "07:00:00",
      cutoff_time: "09:00:00",
      close_time: "17:00:00",
      created_by: admin.id,
    },
  ]);
}
