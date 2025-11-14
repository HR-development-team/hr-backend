import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // 1. Hapus data lama
  await knex("attendance_sessions").del();

  // 2. Ambil user admin untuk kolom 'created_by'
  const adminUser = await knex("users")
    .where({ user_code: "USR0000003" }) // <-- PASTIKAN INI BENAR
    .first();

  if (!adminUser) {
    // eslint-disable-next-line no-console
    console.error("Admin user (USR0000003) not found for seeding sessions.");
    return;
  }

  // 3. Buat 10 data sesi manual
  const sessions = [
    {
      session_code: "SSA0000001",
      date: "2025-11-11",
      status: "closed",
      open_time: "08:00:00",
      cutoff_time: "09:00:00",
      close_time: "17:00:00",
      created_by: adminUser.user_code, // <-- Ini akan menjadi USR0000003
    },
    {
      session_code: "SSA0000002",
      date: "2025-11-12",
      status: "closed",
      open_time: "08:00:00",
      cutoff_time: "09:00:00",
      close_time: "17:00:00",
      created_by: adminUser.user_code,
    },
    {
      session_code: "SSA0000003",
      date: "2025-11-13",
      status: "closed",
      open_time: "08:00:00",
      cutoff_time: "09:00:00",
      close_time: "17:00:00",
      created_by: adminUser.user_code,
    },
    {
      session_code: "SSA0000004",
      date: "2025-11-14",
      status: "closed",
      open_time: "08:00:00",
      cutoff_time: "09:00:00",
      close_time: "17:00:00",
      created_by: adminUser.user_code,
    },
    {
      session_code: "SSA0000005",
      date: "2025-11-15",
      status: "closed",
      open_time: "08:00:00",
      cutoff_time: "09:00:00",
      close_time: "17:00:00",
      created_by: adminUser.user_code,
    },
    {
      session_code: "SSA0000006",
      date: "2025-11-16",
      status: "closed",
      open_time: "08:00:00",
      cutoff_time: "09:00:00",
      close_time: "17:00:00",
      created_by: adminUser.user_code,
    },
    {
      session_code: "SSA0000007",
      date: "2025-11-17",
      status: "closed",
      open_time: "08:00:00",
      cutoff_time: "09:00:00",
      close_time: "17:00:00",
      created_by: adminUser.user_code,
    },
    {
      session_code: "SSA0000008",
      date: "2025-11-18",
      status: "closed",
      open_time: "08:00:00",
      cutoff_time: "09:00:00",
      close_time: "17:00:00",
      created_by: adminUser.user_code,
    },
    {
      session_code: "SSA0000009",
      date: "2025-11-19",
      status: "closed",
      open_time: "08:00:00",
      cutoff_time: "09:00:00",
      close_time: "17:00:00",
      created_by: adminUser.user_code,
    },
    {
      session_code: "SSA0000010",
      date: "2025-11-20",
      status: "open",
      open_time: "08:00:00",
      cutoff_time: "09:00:00",
      close_time: "17:00:00",
      created_by: adminUser.user_code,
    },
  ];

  // 4. Masukkan data ke database
  await knex("attendance_sessions").insert(sessions);
}
